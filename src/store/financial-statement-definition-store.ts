import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { toast } from 'sonner'

import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'

import { IFinancialStatementDefinition, TEntityId } from '@/types'

interface FinancialStatementStore {
    financialStatementAccountsGroupingId: string | null
    selectedFinancialStatementDefinitionId?: string | null
    openAddAccountPickerModal?: boolean
    financialStatementDefinitions: IFinancialStatementDefinition[]
    onCreate?: boolean
    isReadOnly?: boolean
    openCreateFinancialStatementModal: boolean
    expandedNodeIds: Set<string>
    targetNodeId: string | null
    selectedFinancialStatementDefinition: IFinancialStatementDefinition | null

    setFinancialStatmentAccountsGroupingId: (paymentType: string) => void
    setselectedFinancialStatementDefinitionId: (id: string | null) => void
    setAddAccountPickerModalOpen?: (open: boolean) => void
    setFinancialStatementDefinitions: (
        financialStatementDefinitions: IFinancialStatementDefinition[]
    ) => void
    moveFinancialStatementLedgerNode: (
        path: string[],
        activeId: string | number,
        overId: string | number,
        updateIndex: UseMutateAsyncFunction<
            IFinancialStatementDefinition,
            number,
            {
                generalLedgerDefinitionId: TEntityId
                index: number
            },
            unknown
        >
    ) => void
    setOnCreate?: (onCreate: boolean) => void
    setIsReadyOnly?: (isReadyOnly: boolean) => void
    setOpenCreateFinancialStatementModal?: (open: boolean) => void
    setOpenAddAccountPickerModal?: (open: boolean) => void
    toggleNode: (nodeId: string, isExpanded: boolean) => void
    expandPath: (path: string[]) => void
    setTargetNodeId: (nodeId: string | null) => void
    clearTargetNodeIdAfterScroll: (nodeId: string) => void
    resetExpansion: () => void
    setSelectedFinancialStatementDefinition?: (
        generalLedgerDefinitions: IFinancialStatementDefinition
    ) => void
}

export const useFinancialStatementStore = create<FinancialStatementStore>(
    (set, get) => ({
        targetNodeId: null,
        expandedNodeIds: new Set(),
        financialStatementDefinitions: [],
        openCreateFinancialStatementModal: false,
        financialStatementAccountsGroupingId: null,
        selectedFinancialStatementDefinition: null,
        selectedFinancialStatementDefinitionId: null,

        setselectedFinancialStatementDefinitionId: (id) =>
            set({ selectedFinancialStatementDefinitionId: id }),
        clearselectedFinancialStatementDefinitionId: () =>
            set({ selectedFinancialStatementDefinitionId: null }),
        setFinancialStatmentAccountsGroupingId: (paymentType) =>
            set({ financialStatementAccountsGroupingId: paymentType }),
        setAddAccountPickerModalOpen: (open) =>
            set({ openAddAccountPickerModal: open }),
        setFinancialStatementDefinitions: (financialStatementDefinitions) =>
            set({ financialStatementDefinitions }),
        moveFinancialStatementLedgerNode: async (
            path,
            activeId,
            overId,
            updateIndex
        ) => {
            if (!activeId || !overId) {
                toast.error('Invalid drag operation.')
                return
            }
            if (activeId === overId) {
                toast.info('No change in position.')
                return
            }

            if (typeof updateIndex !== 'function') {
                toast.error('Update index function is not provided.')
                return
            }

            const prevLedgerData = get().financialStatementDefinitions
            const newLedger = structuredClone(prevLedgerData)

            const findTargetArray = (
                data: IFinancialStatementDefinition[],
                path: string[]
            ): IFinancialStatementDefinition[] | null => {
                let current = data
                for (const id of path) {
                    const node = current.find((item) => item.id === id)
                    if (!node) return null
                    current = node.financial_statement_definition || []
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

            if (typeof updateIndex === 'function') {
                await updateIndex({
                    generalLedgerDefinitionId: activeId as TEntityId,
                    index: newIndex,
                })
            }

            const updated = arrayMove(sorted, oldIndex, newIndex).map(
                (item, i) => ({
                    ...item,
                    index: i,
                })
            )

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
                                general_ledger_definition: updated,
                            }
                        }
                        return {
                            ...node,
                            general_ledger_definition: updateTree(
                                node.financial_statement_definition || [],
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

            set({ financialStatementDefinitions: finalLedger })
        },
        setIsReadyOnly: (isReadyOnly) => set({ isReadOnly: isReadyOnly }),
        setOnCreate: (onCreate) => set({ onCreate }),
        setOpenCreateFinancialStatementModal: (open) =>
            set({ openCreateFinancialStatementModal: open }),
        toggleNode: (nodeId, isExpanded) =>
            set((state) => {
                const newExpandedIds = new Set(state.expandedNodeIds)
                if (isExpanded) {
                    newExpandedIds.add(nodeId)
                } else {
                    newExpandedIds.delete(nodeId)
                }
                return { expandedNodeIds: newExpandedIds }
            }),
        expandPath: (path) =>
            set(() => ({
                expandedNodeIds: new Set(path),
            })),
        setTargetNodeId: (nodeId) => set({ targetNodeId: nodeId }),
        clearTargetNodeIdAfterScroll: (nodeId) => {
            if (get().targetNodeId === nodeId) {
                set({ targetNodeId: null })
            }
        },
        resetExpansion: () =>
            set({ expandedNodeIds: new Set(), targetNodeId: null }),
        setSelectedFinancialStatementDefinition: (generalLedgerDefinitions) =>
            set({
                selectedFinancialStatementDefinition: generalLedgerDefinitions,
            }),
    })
)
