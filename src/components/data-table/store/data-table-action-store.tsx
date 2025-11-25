import { ReactNode, createContext, useContext, useMemo } from 'react'

import { useStore } from 'zustand'
import { StoreApi, createStore } from 'zustand/vanilla'

export type RowActionType = string

export interface TableRowActionState<
    T = Record<string, unknown>,
    A extends RowActionType = string,
    E = Record<string, unknown>,
> {
    action?: A | null
    isOpen: boolean
    id?: string
    defaultValues?: T
    extra?: E
}

export interface TableRowActionStore<
    T = Record<string, unknown>,
    A extends RowActionType = string,
    E = Record<string, unknown>,
> {
    state: TableRowActionState<T, A, E>
    open: (action: A, payload?: Partial<TableRowActionState<T, A, E>>) => void
    close: () => void
}

export function createTableRowActionStore<
    T = Record<string, unknown>,
    A extends RowActionType = string,
    E = Record<string, unknown>,
>() {
    return createStore<TableRowActionStore<T, A, E>>((set) => ({
        state: { action: null, isOpen: false },

        open: (action, payload = {}) =>
            set({ state: { action, isOpen: true, ...payload } }),

        close: () =>
            set((state) => ({ state: { ...state.state, isOpen: false } })),
    }))
}

const TableRowActionStoreContext = createContext<StoreApi<
    TableRowActionStore<unknown, string>
> | null>(null)

export function TableRowActionStoreProvider<
    T = Record<string, unknown>,
    A extends RowActionType = string,
    E = Record<string, unknown>,
>({ children }: { children: ReactNode }) {
    const store = useMemo(() => createTableRowActionStore<T, A, E>(), [])
    return (
        <TableRowActionStoreContext.Provider
            value={
                store as unknown as StoreApi<
                    TableRowActionStore<unknown, string>
                >
            }
        >
            {children}
        </TableRowActionStoreContext.Provider>
    )
}

export function useTableRowActionStore<
    T = Record<string, unknown>,
    A extends RowActionType = string,
    E = Record<string, unknown>,
>() {
    const store = useContext(TableRowActionStoreContext) as StoreApi<
        TableRowActionStore<T, A, E>
    > | null
    if (!store)
        throw new Error(
            'useTableRowActionStore must be inside TableRowActionStoreProvider'
        )

    const state = useStore(store, (s) => s.state)
    const open = store.getState().open
    const close = store.getState().close

    return { state, open, close }
}
