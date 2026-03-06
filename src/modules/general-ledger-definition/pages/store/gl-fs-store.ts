import { toast } from 'sonner'

import { IAccount } from '@/modules/account'
import { IGeneralLedgerDefinition } from '@/modules/general-ledger-definition'
import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'

import { UpdateAccountOrder } from '@/types'

export interface GLFSStoreProps {
    generalLedgerDefinitions: IGeneralLedgerDefinition[]

    changedAccounts: UpdateAccountOrder[]
    changedGeneralLedgerItems: UpdateAccountOrder[]

    expandedNodeIds: Set<string>
    targetNodeId: string | null

    setGeneralLedgerDefinitions: (data: IGeneralLedgerDefinition[]) => void

    setChangedAccounts: (data: UpdateAccountOrder[]) => void
    setChangedGeneralLedgerItems: (data: UpdateAccountOrder[]) => void

    toggleNode: (nodeId: string, isExpanded: boolean) => void
    expandPath: (path: string[]) => void

    setTargetNodeId: (nodeId: string | null) => void
    clearTargetNodeIdAfterScroll: (nodeId: string) => void
    resetExpansion: () => void

    moveGeneralLedgerNode: (
        path: string[],
        activeId: string | number,
        overId: string | number
    ) => void
    updateAccounts: (glId: string, accounts: IAccount[]) => void
}

export const useGLFSStore = create<GLFSStoreProps>((set, get) => ({
    generalLedgerDefinitions: [],

    changedAccounts: [],
    changedGeneralLedgerItems: [],

    targetNodeId: null,
    expandedNodeIds: new Set(),

    setGeneralLedgerDefinitions: (data) =>
        set({ generalLedgerDefinitions: data }),
    setChangedAccounts: (data) => set({ changedAccounts: data }),
    setChangedGeneralLedgerItems: (data) =>
        set({ changedGeneralLedgerItems: data }),

    toggleNode: (nodeId, isExpanded) =>
        set((state) => {
            const expanded = new Set(state.expandedNodeIds)

            if (isExpanded) {
                expanded.add(nodeId)
            } else {
                expanded.delete(nodeId)
            }

            return { expandedNodeIds: expanded }
        }),
    expandPath: (path) =>
        set({
            expandedNodeIds: new Set(path),
        }),
    setTargetNodeId: (nodeId) => set({ targetNodeId: nodeId }),
    clearTargetNodeIdAfterScroll: (nodeId) => {
        if (get().targetNodeId === nodeId) {
            set({ targetNodeId: null })
        }
    },
    resetExpansion: () =>
        set({
            expandedNodeIds: new Set(),
            targetNodeId: null,
        }),
    moveGeneralLedgerNode: (path, activeId, overId) => {
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

                current = node.general_ledger_definition_entries || []
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
                    item.id !== sorted[i]?.id || item.index !== sorted[i]?.index
            )
            .map((item) => ({
                account_id: item.id,
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
                            general_ledger_definition_entries: updated,
                        }
                    }

                    return {
                        ...node,
                        general_ledger_definition_entries: updateTree(
                            node.general_ledger_definition_entries || [],
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
    updateAccounts: (glId: string, accounts: IAccount[]) =>
        set((state) => ({
            generalLedgerDefinitions: state.generalLedgerDefinitions.map(
                (gl) => (gl.id === glId ? { ...gl, accounts } : gl)
            ),
        })),
}))
