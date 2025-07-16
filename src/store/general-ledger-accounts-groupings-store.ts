import { toast } from 'sonner'

import {
    GeneralLedgerTypeEnum,
    IGeneralLedgerDefinition,
} from '@/types/coop-types/general-ledger-definitions'
import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'

import { TEntityId, UpdateIndexRequest } from '@/types'

export interface GeneralLedgerAccountsGroupingStore {
    generalLedgerAccountsGroupingId: string | null
    selectedGeneralLedgerDefinitionId?: string | null
    generalLedgerDefinitions: IGeneralLedgerDefinition[]
    onCreate?: boolean
    isReadOnly?: boolean
    openCreateGeneralLedgerModal: boolean
    selectedGeneralLedgerDefinition: IGeneralLedgerDefinition | null
    changedGeneralLedgerItems: UpdateIndexRequest[]
    setChangedGeneralLedgerItems: (data: UpdateIndexRequest[]) => void

    selectedGeneralLedgerTypes: GeneralLedgerTypeEnum | null
    generalLedgerDefinitionEntriesId?: TEntityId
    changedAccounts: UpdateIndexRequest[]

    setGeneralLedgerDefinitionEntriesId?: (
        generalLedgerDefinitionEntriesId: string | undefined
    ) => void
    setGeneralLedgerAccountsGroupingId: (paymentType: string) => void
    setSelectedGeneralLedgerDefinitionId: (id: string | null) => void
    setgeneralLedgerDefinitions: (
        generalLedgerDefinitions: IGeneralLedgerDefinition[]
    ) => void
    moveGeneralLedgerNode: (
        path: string[],
        activeId: string | number,
        overId: string | number
    ) => void
    setOnCreate?: (onCreate: boolean) => void
    setIsReadyOnly?: (isReadyOnly: boolean) => void
    setOpenCreateGeneralLedgerModal?: (open: boolean) => void
    setSelectedGeneralLedgerDefinition?: (
        generalLedgerDefinitions: IGeneralLedgerDefinition | null
    ) => void
    setGeneralLedgerType?: (
        generalLedgerType: GeneralLedgerTypeEnum | null
    ) => void
}

export const useGeneralLedgerAccountsGroupingStore =
    create<GeneralLedgerAccountsGroupingStore>((set, get) => ({
        generalLedgerDefinitions: [],
        openCreateGeneralLedgerModal: false,
        generalLedgerAccountsGroupingId: null,
        selectedGeneralLedgerDefinition: null,
        selectedGeneralLedgerDefinitionId: null,
        changedGeneralLedgerItems: [],
        selectedGeneralLedgerTypes: null,
        changedAccounts: [],
        openViewAccountModal: false,
        selectedAccounts: null,
        openGeneralLedgerAccountTableModal: false,

        setGeneralLedgerType: (generalLedgerType) =>
            set({ selectedGeneralLedgerTypes: generalLedgerType }),
        setChangedGeneralLedgerItems: (data) =>
            set({ changedGeneralLedgerItems: data }),
        setSelectedGeneralLedgerDefinitionId: (id) =>
            set({ selectedGeneralLedgerDefinitionId: id }),
        clearSelectedGeneralLedgerDefinitionId: () =>
            set({ selectedGeneralLedgerDefinitionId: null }),
        setGeneralLedgerAccountsGroupingId: (paymentType) =>
            set({ generalLedgerAccountsGroupingId: paymentType }),
        setgeneralLedgerDefinitions: (generalLedgerDefinitions) =>
            set({ generalLedgerDefinitions }),
        moveGeneralLedgerNode: async (path, activeId, overId) => {
            const prevLedgerData = get().generalLedgerDefinitions
            const newLedger = structuredClone(prevLedgerData)

            const findTargetArray = (
                data: IGeneralLedgerDefinition[],
                path: string[]
            ): IGeneralLedgerDefinition[] | null => {
                let current = data
                for (const id of path) {
                    const node = current.find((item) => item.id === id)
                    if (!node) return null
                    current = node.general_ledger_definition || []
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

            set({ changedGeneralLedgerItems: changedItems })

            const updateTree = (
                nodes: IGeneralLedgerDefinition[],
                path: string[],
                level = 0
            ): IGeneralLedgerDefinition[] => {
                return nodes.map((node) => {
                    if (node.id === path[level]) {
                        if (level === path.length - 1) {
                            return {
                                ...node,
                                general_ledger_definition: updated,
                            }
                        }
                        return {
                            ...node,
                            general_ledger_definition: updateTree(
                                node.general_ledger_definition || [],
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

            set({ generalLedgerDefinitions: finalLedger })
        },
        setIsReadyOnly: (isReadyOnly) => set({ isReadOnly: isReadyOnly }),
        setOnCreate: (onCreate) => set({ onCreate }),
        setOpenCreateGeneralLedgerModal: (open) =>
            set({ openCreateGeneralLedgerModal: open }),
        setSelectedGeneralLedgerDefinition: (generalLedgerDefinitions) =>
            set({
                selectedGeneralLedgerDefinition: generalLedgerDefinitions,
            }),
        setGeneralLedgerDefinitionEntriesId: (
            generalLedgerDefinitionEntriesId
        ) =>
            set({
                generalLedgerDefinitionEntriesId:
                    generalLedgerDefinitionEntriesId,
            }),
    }))
