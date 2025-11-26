import { ReactNode, createContext, useContext, useMemo } from 'react'

import { useStore } from 'zustand'
import { StoreApi, createStore } from 'zustand/vanilla'

export type RowActionType = string

export interface TableRowActionState<
    TData = Record<string, unknown>,
    TAction extends RowActionType = string,
    TExtra = Record<string, unknown>,
> {
    action?: TAction | null
    isOpen: boolean
    id?: string
    defaultValues?: TData
    extra?: TExtra
}

export interface TableRowActionStore<
    TData = Record<string, unknown>,
    TAction extends RowActionType = string,
    TExtra = Record<string, unknown>,
> {
    state: TableRowActionState<TData, TAction, TExtra>
    open: (
        action: TAction,
        payload?: Partial<TableRowActionState<TData, TAction, TExtra>>
    ) => void
    close: () => void
}

export function createTableRowActionStore<
    TData = Record<string, unknown>,
    TAction extends RowActionType = string,
    TExtra = Record<string, unknown>,
>() {
    return createStore<TableRowActionStore<TData, TAction, TExtra>>((set) => ({
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
    TData = Record<string, unknown>,
    TAction extends RowActionType = string,
    TExtra = Record<string, unknown>,
>({ children }: { children: ReactNode }) {
    const store = useMemo(
        () => createTableRowActionStore<TData, TAction, TExtra>(),
        []
    )
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
    TData = Record<string, unknown>,
    TAction extends RowActionType = string,
    TExtra = Record<string, unknown>,
>() {
    const store = useContext(TableRowActionStoreContext) as StoreApi<
        TableRowActionStore<TData, TAction, TExtra>
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
