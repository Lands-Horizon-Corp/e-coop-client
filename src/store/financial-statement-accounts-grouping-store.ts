import { toast } from 'sonner'

import {
    FinancialStatementTypeEnum,
    IFinancialStatementDefinition,
} from '@/modules/financial-statement-definition'
import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'

import { TEntityId, UpdateIndexRequest } from '@/types'

interface FinancialStatementAccountsGroupingStore {
    financialStatementAccountsGroupingId: string | null
    selectedFinancialStatementDefinitionId?: string | null
    financialStatementDefinition: IFinancialStatementDefinition[]
    onCreate?: boolean
    isReadOnly?: boolean
    openCreateFinancialStatementModal: boolean

    selectedFinancialStatementDefinition: IFinancialStatementDefinition | null
    financialStatementDefinitionEntriesId?: TEntityId
    changedFinancialStatementItems: UpdateIndexRequest[]
    selectedFinancialStatementTypes?: FinancialStatementTypeEnum | null

    setFinancialStatmentAccountsGroupingId: (paymentType: string) => void
    setSelectedFinancialStatementDefinitionId: (id: string | null) => void
    setFinancialStatementDefinition: (
        financialStatementDefinition: IFinancialStatementDefinition[]
    ) => void
    moveFinancialStatementLedgerNode: (
        path: string[],
        activeId: string | number,
        overId: string | number
    ) => void
    setOnCreate?: (onCreate: boolean) => void
    setIsReadyOnly?: (isReadyOnly: boolean) => void
    setOpenCreateFinancialStatementModal?: (open: boolean) => void

    setSelectedFinancialStatementDefinition?: (
        financialStatementDefinition: IFinancialStatementDefinition | null
    ) => void
    setFinancialStatementDefinitionEntriesId: (
        financialStatementDefinitionEntriesId: TEntityId | undefined
    ) => void
    setChangedFinancialStatementItems: (data: UpdateIndexRequest[]) => void
    setFinancialStatementType?: (
        financialStatementType: FinancialStatementTypeEnum | null
    ) => void
}

export const useFinancialStatementAccountsGroupingStore =
    create<FinancialStatementAccountsGroupingStore>((set, get) => ({
        financialStatementDefinition: [],
        openCreateFinancialStatementModal: false,
        financialStatementAccountsGroupingId: null,
        selectedFinancialStatementDefinition: null,
        selectedFinancialStatementDefinitionId: null,
        changedFinancialStatementItems: [],

        setFinancialStatementType: (financialStatementType) =>
            set({ selectedFinancialStatementTypes: financialStatementType }),
        setSelectedFinancialStatementDefinitionId: (id) =>
            set({ selectedFinancialStatementDefinitionId: id }),
        clearselectedFinancialStatementDefinitionId: () =>
            set({ selectedFinancialStatementDefinitionId: null }),
        setFinancialStatmentAccountsGroupingId: (paymentType) =>
            set({ financialStatementAccountsGroupingId: paymentType }),
        setFinancialStatementDefinition: (financialStatementDefinition) =>
            set({ financialStatementDefinition }),
        moveFinancialStatementLedgerNode: async (path, activeId, overId) => {
            const prevLedgerData = get().financialStatementDefinition
            const newLedger = structuredClone(prevLedgerData)

            const findTargetArray = (
                data: IFinancialStatementDefinition[],
                path: string[]
            ): IFinancialStatementDefinition[] | null => {
                let current = data
                for (const id of path) {
                    const node = current.find((item) => item.id === id)
                    if (!node) return null
                    current = node.financial_statement_definition_entries || []
                }
                return current
            }

            const targetArray =
                path.length === 0 ? newLedger : findTargetArray(newLedger, path)

            if (!targetArray) {
                toast.error('Target array not found for drag operation.')
                return
            }

            const sorted = [...targetArray].sort(
                (a, b) => (a.index ?? 0) - (b.index ?? 0)
            )

            const oldIndex = sorted.findIndex((item) => item.id === activeId)
            const newIndex = sorted.findIndex((item) => item.id === overId)

            if (oldIndex === -1 || newIndex === -1) {
                toast.warning('Invalid drag indexes.')
                return
            }

            if (oldIndex === newIndex) {
                toast.info('No change in position.')
                return
            }

            const updated = arrayMove(sorted, oldIndex, newIndex).map(
                (item, i) => ({
                    ...item,
                    index: i,
                })
            )

            const changedItems = updated
                .filter(
                    (item, i) =>
                        item.id !== sorted[i]?.id ||
                        item.index !== sorted[i]?.index
                )
                .map((item) => ({
                    id: item.id,
                    index: item.index,
                }))

            set({ changedFinancialStatementItems: changedItems })

            const updateTree = (
                nodes: IFinancialStatementDefinition[],
                path: string[],
                level = 0
            ): IFinancialStatementDefinition[] => {
                return nodes.map((node) => {
                    if (node.id === path[level]) {
                        if (level === path.length - 1) {
                            return {
                                ...node,
                                financial_statement_definition_entries: updated,
                            }
                        }
                        return {
                            ...node,
                            financial_statement_definition_entries: updateTree(
                                node.financial_statement_definition_entries ||
                                    [],
                                path,
                                level + 1
                            ),
                        }
                    }
                    return node
                })
            }

            const finalLedger =
                path.length === 0 ? updated : updateTree(newLedger, path)

            set({ financialStatementDefinition: finalLedger })
        },
        setIsReadyOnly: (isReadyOnly) => set({ isReadOnly: isReadyOnly }),
        setOnCreate: (onCreate) => set({ onCreate }),
        setOpenCreateFinancialStatementModal: (open) =>
            set({ openCreateFinancialStatementModal: open }),

        setSelectedFinancialStatementDefinition: (
            financialStatementDefinition
        ) =>
            set({
                selectedFinancialStatementDefinition:
                    financialStatementDefinition,
            }),
        setFinancialStatementDefinitionEntriesId: (
            financialStatementDefinitionEntriesId
        ) => set({ financialStatementDefinitionEntriesId }),
        setChangedFinancialStatementItems: (data) =>
            set({ changedFinancialStatementItems: data }),
    }))
