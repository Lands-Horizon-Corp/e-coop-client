import { toast } from 'sonner'

import { IAccount } from '@/types/coop-types/accounts/account'
import {
    GeneralLedgerTypeEnum,
    IGeneralLedgerDefinition,
} from '@/types/coop-types/general-ledger-definitions'
import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'

import { UpdateIndexRequest } from '@/types'

export interface GeneralLedgerAccountsGroupingStore {
    generalLedgerAccountsGroupingId: string | null
    selectedGeneralLedgerDefinitionId?: string | null
    openAddAccountPickerModal?: boolean
    generalLedgerDefitions: IGeneralLedgerDefinition[]
    onCreate?: boolean
    isReadOnly?: boolean
    openCreateGeneralLedgerModal: boolean
    expandedNodeIds: Set<string>
    targetNodeId: string | null
    selectedGeneralLedgerDefinition: IGeneralLedgerDefinition | null
    changedGeneralLedgerItems: UpdateIndexRequest[]
    selectedGeneralLedgerTypes: GeneralLedgerTypeEnum | null
    generalDefinitionEntriesId?: string
    changedAccounts: UpdateIndexRequest[]
    openViewAccountModal?: boolean
    selectedAccounts?: IAccount | null
    openGeneralLedgerAccountTableModal?: boolean

    setOpenGeneralLedgerAccountTableModal?: (open: boolean) => void
    setSelectedAccounts?: (accounts: IAccount | null) => void
    setViewAccountModalOpen?: (open: boolean) => void
    setChangedAccounts?: (data: UpdateIndexRequest[]) => void
    setGeneralLedgerDefinitionEntriesId?: (
        generalLedgerDefinitionEntriesId: string | undefined
    ) => void
    setGeneralLedgerAccountsGroupingId: (paymentType: string) => void
    setSelectedGeneralLedgerDefinitionId: (id: string | null) => void
    setAddAccountPickerModalOpen?: (open: boolean) => void
    setGEneralLedgerDefitions: (
        generalLedgerDefitions: IGeneralLedgerDefinition[]
    ) => void
    moveGeneralLedgerNode: (
        path: string[],
        activeId: string | number,
        overId: string | number
    ) => void
    setOnCreate?: (onCreate: boolean) => void
    setIsReadyOnly?: (isReadyOnly: boolean) => void
    setOpenCreateGeneralLedgerModal?: (open: boolean) => void
    setOpenAddAccountPickerModal?: (open: boolean) => void
    toggleNode: (nodeId: string, isExpanded: boolean) => void
    expandPath: (path: string[]) => void
    setTargetNodeId: (nodeId: string | null) => void
    clearTargetNodeIdAfterScroll: (nodeId: string) => void
    resetExpansion: () => void
    setSelectedGeneralLedgerDefinition?: (
        generalLedgerDefinitions: IGeneralLedgerDefinition | null
    ) => void
    setChangedGeneralLedgerItems: (data: UpdateIndexRequest[]) => void
    setGeneralLedgerType?: (
        generalLedgerType: GeneralLedgerTypeEnum | null
    ) => void
}

export const useGeneralLedgerStore = create<GeneralLedgerAccountsGroupingStore>(
    (set, get) => ({
        targetNodeId: null,
        expandedNodeIds: new Set(),
        generalLedgerDefitions: [],
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

        setOpenGeneralLedgerAccountTableModal: (open) =>
            set({ openGeneralLedgerAccountTableModal: open }),
        setSelectedAccounts: (accounts) => set({ selectedAccounts: accounts }),
        setViewAccountModalOpen: (open) => set({ openViewAccountModal: open }),
        setChangedAccounts: (data) => set({ changedAccounts: data }),
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
        setAddAccountPickerModalOpen: (open) =>
            set({ openAddAccountPickerModal: open }),
        setGEneralLedgerDefitions: (generalLedgerDefitions) =>
            set({ generalLedgerDefitions }),
        moveGeneralLedgerNode: async (path, activeId, overId) => {
            const prevLedgerData = get().generalLedgerDefitions
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

            set({ generalLedgerDefitions: finalLedger })
        },
        setIsReadyOnly: (isReadyOnly) => set({ isReadOnly: isReadyOnly }),
        setOnCreate: (onCreate) => set({ onCreate }),
        setOpenCreateGeneralLedgerModal: (open) =>
            set({ openCreateGeneralLedgerModal: open }),
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
        setSelectedGeneralLedgerDefinition: (generalLedgerDefinitions) =>
            set({
                selectedGeneralLedgerDefinition: generalLedgerDefinitions,
            }),
        setGeneralLedgerDefinitionEntriesId: (
            generalLedgerDefinitionEntriesId
        ) =>
            set({
                generalDefinitionEntriesId: generalLedgerDefinitionEntriesId,
            }),
    })
)
