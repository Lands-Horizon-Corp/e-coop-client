import { IAccount } from '@/modules/account'
import { create } from 'zustand'

import { UpdateIndexRequest } from '@/types'

export interface GLFSStoreProps {
    openAddAccountPickerModal: boolean
    openViewAccountModal?: boolean
    selectedAccounts?: IAccount | null
    openGeneralLedgerAccountTableModal?: boolean
    changedAccounts: UpdateIndexRequest[]
    expandedNodeIds: Set<string>
    targetNodeId: string | null

    setSelectedAccounts?: (accounts: IAccount | null) => void
    setOpenAddAccountPickerModal?: (open: boolean) => void
    setViewAccountModalOpen?: (open: boolean) => void
    setOpenGeneralLedgerAccountTableModal?: (open: boolean) => void
    setChangedAccounts?: (data: UpdateIndexRequest[]) => void
    toggleNode: (nodeId: string, isExpanded: boolean) => void
    expandPath: (path: string[]) => void
    setTargetNodeId: (nodeId: string | null) => void
    clearTargetNodeIdAfterScroll: (nodeId: string) => void
    resetExpansion: () => void
    setAddAccountPickerModalOpen: (open: boolean) => void
}

export const useGLFSStore = create<GLFSStoreProps>((set, get) => ({
    openAddAccountPickerModal: false,
    openViewAccountModal: false,
    selectedAccounts: null,
    openGeneralLedgerAccountTableModal: false,
    changedAccounts: [],
    targetNodeId: null,
    expandedNodeIds: new Set(),

    setOpenAddAccountPickerModal: (open) =>
        set({ openAddAccountPickerModal: open }),
    setViewAccountModalOpen: (open) => set({ openViewAccountModal: open }),
    setSelectedAccounts: (accounts) => set({ selectedAccounts: accounts }),
    setOpenGeneralLedgerAccountTableModal: (open) =>
        set({ openGeneralLedgerAccountTableModal: open }),
    setChangedAccounts: (data) => set({ changedAccounts: data }),

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
    setAddAccountPickerModalOpen: (open) =>
        set({ openAddAccountPickerModal: open }),
}))
