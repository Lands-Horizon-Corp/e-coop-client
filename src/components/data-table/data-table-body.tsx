import { cn } from '@/lib'
import { Row, flexRender } from '@tanstack/react-table'

import { TableBody, TableCell, TableRow } from '@/components/ui/table'

import { MagnifyingGlassIcon } from '../icons'
import { getPinningStyles } from './data-table-utils'

const DataTableBody = <TData,>({
    rows,
    colCount,
    rowClassName,
    onRowClick,
}: {
    rows: Row<TData>[]
    colCount?: number
    rowClassName?: string

    onRowClick?: (row: Row<TData>) => void
}) => {
    return (
        <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-row-id={row.id}
                    className={cn('h-14', rowClassName)}
                    onClick={() => onRowClick?.(row)}
                    data-state={row.getIsSelected() && 'selected'}
                >
                    {row.getVisibleCells().map((cell) => {
                        const { column } = cell
                        const isPinned = column.getIsPinned()
                        const isLastLeftPinned =
                            isPinned === 'left' &&
                            column.getIsLastColumn('left')
                        const isFirstRightPinned =
                            isPinned === 'right' &&
                            column.getIsFirstColumn('right')

                        return (
                            <TableCell
                                key={cell.id}
                                className="data-[pinned]:bg-muted/60 data-[pinned]:backdrop-blur-md [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&_*]:truncate"
                                style={{
                                    ...getPinningStyles(column),
                                }}
                                data-pinned={isPinned || undefined}
                                data-last-col={
                                    isLastLeftPinned
                                        ? 'left'
                                        : isFirstRightPinned
                                          ? 'right'
                                          : undefined
                                }
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        )
                    })}
                </TableRow>
            ))}
            {rows.length === 0 && (
                <TableRow>
                    <TableCell colSpan={colCount} className="h-24 text-center">
                        <span className="w-full text-center text-xs text-muted-foreground/60">
                            <MagnifyingGlassIcon className="mr-2 inline" /> no
                            data to display
                        </span>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    )
}

export default DataTableBody
