import { useCallback, useEffect, useState } from 'react'

import { APP_VERSION } from '@/constants'
import { ColumnDef, OnChangeFn, RowSelectionState } from '@tanstack/react-table'

import { getLocalStorage, setLocalStorage } from '@/hooks/use-localstorage'

export type TDataTableDisplayType = 'Default' | 'Full'

interface Props<TData> {
    key?: string[]
    defaultColumnOrder?: string[]
    defaultColumnVisibility?: { [key: string]: boolean }
    onSelectData?: (data: TData[]) => void
}

interface RowSelectionStateWithData<TData> {
    rowSelection: RowSelectionState
    selectedRowsData: Map<string | number, TData>
}

export const buildTableKeyColumnOrder = (key: string[]) => {
    return `data-table.${APP_VERSION}.${key.join('.')}.column-order`
}

export const buildTableKeyColumnVisibility = (key: string[]) => {
    return `data-table.${APP_VERSION}.${key.join('.')}.column-visibility`
}

const useDataTableState = <TData extends { id: string | number }>({
    key,
    defaultColumnOrder = [],
    defaultColumnVisibility = {},
    onSelectData,
}: Props<TData> = {}) => {
    const [rowSelectionState, setRowSelectionState] = useState<
        RowSelectionStateWithData<TData>
    >({
        rowSelection: {},
        selectedRowsData: new Map(),
    })

    const [columnOrder, setColumnOrder] = useState<string[]>(defaultColumnOrder)
    const [columnVisibility, setColumnVisibility] = useState(
        defaultColumnVisibility
    )
    const [isScrollable, setIsScrollable] = useState<boolean>(true)

    const getRowIdFn = useCallback((row: TData) => `${row.id}`, [])

    // PERSIST COLUMN SORT ORDER TO LOCAL STORAGE
    useEffect(() => {
        if (key) {
            const tableUniqueColumnKey = buildTableKeyColumnOrder(key)
            setLocalStorage(tableUniqueColumnKey, columnOrder)
        }
    }, [key, columnOrder])

    // PERSIST COLUMN SORT ORDER TO LOCAL STORAGE
    useEffect(() => {
        if (key) {
            const tableUniqueVisibilityKey = buildTableKeyColumnVisibility(key)
            setLocalStorage(tableUniqueVisibilityKey, columnVisibility)
        }
    }, [key, columnVisibility])

    const createHandleRowSelectionChange = (
        data: TData[]
    ): OnChangeFn<RowSelectionState> => {
        return (updaterOrValue) => {
            setRowSelectionState((prev) => {
                const newRowSelection =
                    typeof updaterOrValue === 'function'
                        ? updaterOrValue(prev.rowSelection)
                        : updaterOrValue

                const newSelectedRowsData = new Map(prev.selectedRowsData)

                data.forEach((row) => {
                    if (newRowSelection[row.id]) {
                        newSelectedRowsData.set(row.id, row)
                    } else {
                        newSelectedRowsData.delete(row.id)
                    }
                })

                onSelectData?.(Array.from(newSelectedRowsData.values()))

                return {
                    rowSelection: newRowSelection,
                    selectedRowsData: newSelectedRowsData,
                }
            })
        }
    }

    return {
        getRowIdFn,
        columnOrder,
        setColumnOrder,
        isScrollable,
        setIsScrollable,
        columnVisibility,
        setColumnVisibility,
        rowSelectionState,
        setRowSelectionState,
        createHandleRowSelectionChange,
    }
}

interface UseResolvedColumnOrderProps<TData> {
    columns: ColumnDef<TData>[]
    persistKey?: (string | undefined | null)[]
}

export const useResolvedColumnOrder = <TData>({
    columns,
    persistKey,
}: UseResolvedColumnOrderProps<TData>) => {
    const finalKeys = persistKey?.filter((k): k is string => Boolean(k))

    const [resolvedColumnOrder] = useState(() => {
        if (!persistKey) {
            return columns.map((c) => c.id!)
        }
        const finalKeys = persistKey?.filter((k): k is string => Boolean(k))

        const persistedOrder = getLocalStorage<string[]>(
            buildTableKeyColumnOrder(finalKeys)
        )

        const currentColumnIds = columns.map((c) => c.id!)

        if (!persistedOrder || !Array.isArray(persistedOrder)) {
            return currentColumnIds
        }

        // Filter out columns that no longer exist
        const validPersistedColumns = persistedOrder.filter((id) =>
            currentColumnIds.includes(id)
        )

        // Add new columns that aren't in the persisted order
        const newColumns = currentColumnIds.filter(
            (id) => !persistedOrder.includes(id)
        )

        // Merge: persisted columns first, then new columns
        return [...validPersistedColumns, ...newColumns]
    })

    const [resolvedColumnVisibility] = useState(() => {
        if (!persistKey) {
            return {}
        }
        const finalKeys = persistKey?.filter((k): k is string => Boolean(k))

        const persistedVisibility = getLocalStorage<{ [key: string]: boolean }>(
            buildTableKeyColumnVisibility(finalKeys)
        )

        if (!persistedVisibility || typeof persistedVisibility !== 'object') {
            return {}
        }

        const currentColumnIds = columns.map((c) => c.id!)

        // Filter out visibility settings for columns that no longer exist
        return Object.keys(persistedVisibility).reduce(
            (acc, key) => {
                if (currentColumnIds.includes(key)) {
                    acc[key] = persistedVisibility[key]
                }
                return acc
            },
            {} as { [key: string]: boolean }
        )
    })

    return { resolvedColumnOrder, resolvedColumnVisibility, finalKeys }
}

export default useDataTableState
