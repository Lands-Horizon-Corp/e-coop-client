import { ReactNode, useEffect } from 'react'

import { cn } from '@/helpers/tw-utils'
import { Column, Row, flexRender } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

import { MagnifyingGlassIcon } from '../icons'
import { getPinningStyles } from './data-table-utils'

const DataTableBody = <TData,>({
    rows,
    colCount,
    tableWidth,
    visibleColumns,
    isScrollable = true,
    isLoading = false,
    skeletonRowCount = 20,
    tableContainerRef,
    rowClassName,
    RowContextComponent,
    onRowClick,
    onDoubleClick,
}: {
    rows: Row<TData>[]
    colCount?: number
    tableWidth?: number
    visibleColumns: Column<TData, unknown>[]
    isScrollable?: boolean
    isLoading?: boolean
    skeletonRowCount?: number
    tableContainerRef: React.RefObject<HTMLDivElement | null>
    rowClassName?: string
    RowContextComponent?: (rowProps: {
        row: Row<TData>
        children?: ReactNode
    }) => ReactNode
    onDoubleClick?: (
        row: Row<TData>,
        e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
    ) => void
    onRowClick?: (
        row: Row<TData>,
        e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
    ) => void
}) => {
    const isFirefox =
        typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent)
    const effectiveRowCount = isLoading ? skeletonRowCount : rows.length

    const rowVirtualizer = useVirtualizer({
        count: effectiveRowCount,
        estimateSize: () => 56,
        getScrollElement: () => tableContainerRef.current,
        measureElement: (element) => {
            if (!element) return 56

            if (isFirefox) {
                return element.scrollHeight
            }

            return element.getBoundingClientRect().height
        },
        overscan: 8,
        enabled: isScrollable,
    })

    useEffect(() => {
        if (!isScrollable) return

        rowVirtualizer.measure()

        const tableContainer = tableContainerRef.current

        if (!tableContainer) return

        const resizeObserver = new ResizeObserver(() => {
            rowVirtualizer.measure()
        })

        resizeObserver.observe(tableContainer)

        return () => resizeObserver.disconnect()
    }, [effectiveRowCount, isScrollable, rowVirtualizer, tableContainerRef])

    const renderSkeletonRow = (index: number, virtualStart?: number) => {
        return (
            <tr
                className={cn(
                    'flex w-full border-b items-center border-border/70 bg-background',
                    rowClassName
                )}
                data-index={index}
                key={`skeleton-row-${index}`}
                ref={(node) => {
                    if (isScrollable && node) {
                        rowVirtualizer.measureElement(node)
                    }
                }}
                style={
                    isScrollable
                        ? {
                              position: 'absolute',
                              transform: `translateY(${virtualStart ?? 0}px)`,
                              width: '100%',
                          }
                        : undefined
                }
            >
                {visibleColumns.map((column) => {
                    const isPinned = column.getIsPinned()
                    const isLastLeftPinned =
                        isPinned === 'left' && column.getIsLastColumn('left')
                    const isFirstRightPinned =
                        isPinned === 'right' && column.getIsFirstColumn('right')

                    return (
                        <td
                            className="border-r border-dashed self-stretch border-border/30 px-3 py-2 align-top text-sm last:border-r-0 data-pinned:bg-muted/50 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border"
                            data-last-col={
                                isLastLeftPinned
                                    ? 'left'
                                    : isFirstRightPinned
                                      ? 'right'
                                      : undefined
                            }
                            data-pinned={isPinned || undefined}
                            key={`skeleton-cell-${column.id}-${index}`}
                            style={{ ...getPinningStyles(column) }}
                        >
                            <Skeleton className="h-9 w-full rounded-xl opacity-30" />
                        </td>
                    )
                })}
            </tr>
        )
    }

    const renderRow = (row: Row<TData>, virtualStart?: number) => {
        const tableRow = (
            <tr
                className={cn(
                    'flex w-full border-b items-center border-border/50 bg-background data-[state=selected]:bg-primary/10',
                    rowClassName
                )}
                data-index={row.index}
                data-row-id={row.id}
                data-state={row.getIsSelected() && 'selected'}
                key={row.id}
                onClick={(e) => onRowClick?.(row, e)}
                onDoubleClick={(e) => onDoubleClick?.(row, e)}
                ref={(node) => {
                    if (isScrollable && node) {
                        rowVirtualizer.measureElement(node)
                    }
                }}
                style={
                    isScrollable
                        ? {
                              position: 'absolute',
                              transform: `translateY(${virtualStart ?? 0}px)`,
                              width: '100%',
                          }
                        : undefined
                }
            >
                {row.getVisibleCells().map((cell) => {
                    const { column } = cell
                    const isPinned = column.getIsPinned()
                    const isLastLeftPinned =
                        isPinned === 'left' && column.getIsLastColumn('left')
                    const isFirstRightPinned =
                        isPinned === 'right' && column.getIsFirstColumn('right')

                    return (
                        <td
                            className="border-r border-dashed self-stretch border-border/30 px-3 py-2 align-top text-sm last:border-r-0 data-pinned:bg-muted/50 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border"
                            data-last-col={
                                isLastLeftPinned
                                    ? 'left'
                                    : isFirstRightPinned
                                      ? 'right'
                                      : undefined
                            }
                            data-pinned={isPinned || undefined}
                            key={cell.id}
                            style={{ ...getPinningStyles(column) }}
                        >
                            {/* <div className="w-full break-words whitespace-normal"> */}
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                            {/* </div> */}
                        </td>
                    )
                })}
            </tr>
        )

        if (RowContextComponent) {
            return (
                <RowContextComponent key={row.id} row={row}>
                    {tableRow}
                </RowContextComponent>
            )
        }

        return tableRow
    }

    return (
        <tbody
            className={cn('block w-full', !isScrollable && 'relative')}
            style={
                isScrollable
                    ? {
                          display: 'grid',
                          height: `${rowVirtualizer.getTotalSize()}px`,
                          position: 'relative',
                      }
                    : undefined
            }
        >
            {isScrollable
                ? rowVirtualizer
                      .getVirtualItems()
                      .map((virtualRow) =>
                          isLoading
                              ? renderSkeletonRow(
                                    virtualRow.index,
                                    virtualRow.start
                                )
                              : renderRow(
                                    rows[virtualRow.index],
                                    virtualRow.start
                                )
                      )
                : isLoading
                  ? Array.from({ length: skeletonRowCount }, (_, index) =>
                        renderSkeletonRow(index)
                    )
                  : rows.map((row) => renderRow(row))}
            {rows.length === 0 && !isLoading && (
                <tr className="flex w-full" style={{ width: tableWidth }}>
                    <td
                        className="h-64 w-full"
                        colSpan={colCount}
                        style={{ minWidth: tableWidth }}
                    >
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <MagnifyingGlassIcon />
                                </EmptyMedia>
                                <EmptyTitle>No Data Available</EmptyTitle>
                                <EmptyDescription>
                                    There are no records to display at this
                                    time.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </td>
                </tr>
            )}
        </tbody>
    )
}

export default DataTableBody
