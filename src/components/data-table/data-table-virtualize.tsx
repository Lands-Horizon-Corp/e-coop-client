/** This table is virtualized, incase big data needs to be displayed */
import { useRef } from 'react'

import { cn } from '@/helpers/tw-utils'
import { Row, Table, flexRender } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Table as UITable,
} from '@/components/ui/table'

import { IClassProps } from '@/types'

interface Props<TData> extends IClassProps {
    table: Table<TData>
    rowClassName?: string
    headerClassName?: string
    wrapperClassName?: string
    isStickyHeader?: boolean
    cellClassName?: string
}

const DataTableVirtualize = <TData,>({
    table,
    className,
    isStickyHeader,
    headerClassName,
    wrapperClassName,
}: Props<TData>) => {
    const tableContainerRef = useRef<HTMLDivElement>(null)

    const { rows } = table.getRowModel()

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        estimateSize: () => 56,
        getScrollElement: () => tableContainerRef.current,
        measureElement:
            typeof window !== 'undefined' &&
            navigator.userAgent.indexOf('Firefox') === -1
                ? (element) => element?.getBoundingClientRect().height
                : undefined,
        overscan: 7,
    })

    return (
        <div
            className={cn(
                'ecoop-scroll relative max-h-full overflow-y-scroll bg-secondary',
                wrapperClassName
            )}
            ref={tableContainerRef}
        >
            <div className="flex h-fit">
                <div className="ecoop-scroll sticky left-0 z-10 w-fit border-r border-popover">
                    <UITable
                        className={cn('grid h-fit', className)}
                        style={{
                            width: table.getLeftTotalSize(),
                        }}
                    >
                        <TableHeader
                            className={cn(
                                'grid w-full',
                                isStickyHeader && 'sticky top-0 z-50'
                            )}
                        >
                            {table.getLeftHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    className="flex w-full bg-popover hover:bg-popover"
                                    key={headerGroup.id}
                                >
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                className={cn(
                                                    'relative z-10 flex bg-popover',
                                                    headerClassName
                                                )}
                                                colSpan={header.colSpan}
                                                key={header.id}
                                                style={{
                                                    width: header.getSize(),
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody
                            className="grid"
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                position: 'relative',
                            }}
                        >
                            {rowVirtualizer
                                .getVirtualItems()
                                .map((virtualRow) => {
                                    const row = rows[
                                        virtualRow.index
                                    ] as Row<TData>
                                    return (
                                        <TableRow
                                            className={cn('h-14 w-fit')}
                                            data-index={virtualRow.index}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                            key={row.id}
                                            ref={(node) =>
                                                rowVirtualizer.measureElement(
                                                    node
                                                )
                                            }
                                            style={{
                                                display: 'flex',
                                                position: 'absolute',
                                                transform: `translateY(${virtualRow.start}px)`,
                                                width: '100%',
                                            }}
                                        >
                                            {row
                                                .getLeftVisibleCells()
                                                .map((cell) => {
                                                    return (
                                                        <TableCell
                                                            className={cn(
                                                                'flex size-fit bg-secondary'
                                                            )}
                                                            key={cell.id}
                                                            style={{
                                                                width: cell.column.getSize(),
                                                            }}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    )
                                                })}
                                        </TableRow>
                                    )
                                })}

                            {table.getRowModel().rows.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        className="h-24 text-center"
                                        colSpan={table.getAllColumns().length}
                                    >
                                        <span className="w-full text-center text-xs text-foreground/60">
                                            no data
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </UITable>
                </div>
                <div className="z-0 flex-1">
                    <UITable
                        className={cn('grid h-fit', className)}
                        style={{
                            width: table.getCenterTotalSize(),
                        }}
                    >
                        <TableHeader
                            className={cn(
                                'grid w-full',
                                isStickyHeader && 'sticky top-0 z-50'
                            )}
                        >
                            {table
                                .getCenterHeaderGroups()
                                .map((headerGroup) => (
                                    <TableRow
                                        className="flex w-full bg-popover hover:bg-popover"
                                        key={headerGroup.id}
                                    >
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    className={cn(
                                                        'relative z-10 flex bg-popover',
                                                        headerClassName
                                                    )}
                                                    colSpan={header.colSpan}
                                                    key={header.id}
                                                    style={{
                                                        width: header.getSize(),
                                                    }}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext()
                                                          )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                        </TableHeader>
                        <TableBody
                            className="grid"
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                position: 'relative',
                            }}
                        >
                            {rowVirtualizer
                                .getVirtualItems()
                                .map((virtualRow) => {
                                    const row = rows[
                                        virtualRow.index
                                    ] as Row<TData>
                                    return (
                                        <TableRow
                                            className={cn('h-14 w-fit')}
                                            data-index={virtualRow.index}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                            key={row.id}
                                            ref={(node) =>
                                                rowVirtualizer.measureElement(
                                                    node
                                                )
                                            }
                                            style={{
                                                display: 'flex',
                                                position: 'absolute',
                                                transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                                                width: '100%',
                                            }}
                                        >
                                            {row
                                                .getCenterVisibleCells()
                                                .map((cell) => {
                                                    return (
                                                        <TableCell
                                                            className={cn(
                                                                'flex size-fit bg-secondary'
                                                            )}
                                                            key={cell.id}
                                                            style={{
                                                                width: cell.column.getSize(),
                                                            }}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    )
                                                })}
                                        </TableRow>
                                    )
                                })}

                            {table.getRowModel().rows.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        className="h-24 text-center"
                                        colSpan={table.getAllColumns().length}
                                    >
                                        <span className="w-full text-center text-xs text-foreground/60">
                                            no data
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </UITable>
                </div>
                <div className="ecoop-scroll sticky right-0 z-10 w-fit border-l border-popover">
                    <UITable
                        className={cn('grid h-fit', className)}
                        style={{
                            width: table.getRightTotalSize(),
                        }}
                    >
                        <TableHeader
                            className={cn(
                                'grid w-full',
                                isStickyHeader && 'sticky top-0 z-50'
                            )}
                        >
                            {table.getRightHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    className="flex w-full bg-popover hover:bg-popover"
                                    key={headerGroup.id}
                                >
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                className={cn(
                                                    'relative z-10 flex bg-popover',
                                                    headerClassName
                                                )}
                                                colSpan={header.colSpan}
                                                key={header.id}
                                                style={{
                                                    width: header.getSize(),
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody
                            className="grid"
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                position: 'relative',
                            }}
                        >
                            {rowVirtualizer
                                .getVirtualItems()
                                .map((virtualRow) => {
                                    const row = rows[
                                        virtualRow.index
                                    ] as Row<TData>
                                    return (
                                        <TableRow
                                            className={cn('h-14 w-fit')}
                                            data-index={virtualRow.index} //needed for dynamic row height measurement
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                            key={row.id}
                                            ref={(node) =>
                                                rowVirtualizer.measureElement(
                                                    node
                                                )
                                            }
                                            style={{
                                                display: 'flex',
                                                position: 'absolute',
                                                transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                                                width: '100%',
                                            }}
                                        >
                                            {row
                                                .getRightVisibleCells()
                                                .map((cell) => {
                                                    return (
                                                        <TableCell
                                                            className={cn(
                                                                'flex size-fit bg-secondary/60'
                                                            )}
                                                            key={cell.id}
                                                            style={{
                                                                width: cell.column.getSize(),
                                                            }}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    )
                                                })}
                                        </TableRow>
                                    )
                                })}

                            {table.getRowModel().rows.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        className="h-24 text-center"
                                        colSpan={table.getAllColumns().length}
                                    >
                                        <span className="w-full text-center text-xs text-foreground/60">
                                            no data
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </UITable>
                </div>
            </div>
        </div>
    )
}

export default DataTableVirtualize
