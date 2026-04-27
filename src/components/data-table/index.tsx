import { ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import {
    ColumnSizingState,
    Row,
    Table as TableInstance,
} from '@tanstack/react-table'

import { IChildProps, IClassProps } from '@/types'

import DataTableBody from './data-table-body'
import DataTableFooter from './data-table-footer'
import DataTableHeader from './data-table-header'

interface ITableProps<TData> extends IClassProps {
    table: TableInstance<TData>
    rowClassName?: string
    isScrollable?: boolean
    isStaticWidth?: boolean
    isStickyHeader?: boolean
    isStickyFooter?: boolean
    isLoading?: boolean
    skeletonRowCount?: number
    onRowClick?: (
        row: Row<TData>,
        e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
    ) => void
    onDoubleClick?: (
        row: Row<TData>,
        e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
    ) => void
    // setColumnOrder?: React.Dispatch<React.SetStateAction<string[]>>
    RowContextComponent?: (
        rowProps: { row: Row<TData> } & IChildProps
    ) => ReactNode
}

const DataTable = <TData,>({
    table,
    className,
    rowClassName,
    isScrollable = true,
    isStickyHeader,
    isStickyFooter,
    isStaticWidth = false,
    isLoading = false,
    skeletonRowCount = 20,
    onDoubleClick,
    onRowClick,
    RowContextComponent,
}: ITableProps<TData>) => {
    const tableContainerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    useEffect(() => {
        const tableContainer = tableContainerRef.current

        if (!tableContainer) return

        const resizeObserver = new ResizeObserver((entries) => {
            const nextWidth = Math.floor(entries[0].contentRect.width)

            setContainerWidth((previousWidth) =>
                previousWidth === nextWidth ? previousWidth : nextWidth
            )
        })

        resizeObserver.observe(tableContainer)

        return () => resizeObserver.disconnect()
    }, [])

    const { columnSizing, columnVisibility } = table.getState()

    useEffect(() => {
        if (!containerWidth || isStaticWidth) return

        const visibleLeafColumns = table.getVisibleLeafColumns()

        if (!visibleLeafColumns.length) return

        const currentTotalWidth = visibleLeafColumns.reduce(
            (total, column) => total + column.getSize(),
            0
        )

        if (currentTotalWidth >= containerWidth) return

        const extraWidth = containerWidth - currentTotalWidth
        const evenExtra = Math.floor(extraWidth / visibleLeafColumns.length)
        const remainder = extraWidth % visibleLeafColumns.length

        const nextSizing = visibleLeafColumns.reduce<ColumnSizingState>(
            (sizing, column, index) => {
                sizing[column.id] =
                    column.getSize() + evenExtra + (index < remainder ? 1 : 0)
                return sizing
            },
            {}
        )

        const hasSizingChanges = visibleLeafColumns.some(
            (column) => column.getSize() !== nextSizing[column.id]
        )

        if (!hasSizingChanges) return

        table.setColumnSizing((previousSizing) => ({
            ...previousSizing,
            ...nextSizing,
        }))
    }, [columnSizing, columnVisibility, containerWidth, isStaticWidth, table])

    const tableTotalSize = table.getTotalSize()
    const visibleLeafColumns = table.getVisibleLeafColumns()
    const resolvedTableWidth =
        isStaticWidth || !containerWidth
            ? tableTotalSize
            : Math.max(tableTotalSize, containerWidth)

    return (
        <div
            className={cn(
                'bg-popover min-w-0 ring-offset-0 ring ring-muted-foreground/20 ecoop-scroll shadow dark:bg-secondary/10 rounded-xl -z-0',
                className,
                isScrollable
                    ? 'h-full grow overflow-auto'
                    : 'h-fit max-h-none min-h-fit overflow-x-scroll'
            )}
            ref={tableContainerRef}
        >
            <table
                className="border-separate border-spacing-0"
                style={{ minWidth: tableTotalSize, width: resolvedTableWidth }}
            >
                <DataTableHeader
                    headerGroups={table.getHeaderGroups()}
                    isStickyHeader={isStickyHeader}
                />
                <DataTableBody
                    colCount={visibleLeafColumns.length}
                    isLoading={isLoading}
                    isScrollable={isScrollable}
                    onDoubleClick={onDoubleClick}
                    onRowClick={onRowClick}
                    rowClassName={rowClassName}
                    RowContextComponent={RowContextComponent}
                    rows={table.getRowModel().rows}
                    skeletonRowCount={skeletonRowCount}
                    tableContainerRef={tableContainerRef}
                    visibleColumns={visibleLeafColumns}
                />
                <DataTableFooter
                    isStickyFooter={isStickyFooter && isScrollable}
                    table={table}
                />
            </table>
        </div>
    )
}

export default DataTable
