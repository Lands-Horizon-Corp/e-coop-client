import { useCallback, useState } from 'react'

import { OnChangeFn, RowSelectionState } from '@tanstack/react-table'

export type TDataTableDisplayType = 'Default' | 'Full'

interface Props<TData> {
    defaultColumnOrder?: string[]
    defaultColumnVisibility?: { [key: string]: boolean }
    onSelectData?: (data: TData[]) => void
}

interface RowSelectionStateWithData<TData> {
    rowSelection: RowSelectionState
    selectedRowsData: Map<string | number, TData>
}

const useDataTableState = <TData extends { id: string | number }>({
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

export default useDataTableState
