import { create } from 'zustand'

interface FinancialStatementStore {
    expandedNodeIds: Set<string>
    targetNodeId: string | null
    toggleNode: (nodeId: string, isExpanded: boolean) => void
    expandPath: (path: string[]) => void
    setTargetNodeId: (nodeId: string | null) => void
    clearTargetNodeIdAfterScroll: (nodeId: string) => void
    resetExpansion: () => void
}

export const useFinancialStatementStore = create<FinancialStatementStore>(
    (set, get) => ({
        expandedNodeIds: new Set(),
        targetNodeId: null,
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
    })
)
