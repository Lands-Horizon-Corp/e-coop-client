import { ReactNode } from 'react'

import { cn } from '@/helpers/tw-utils'
import { Row, flexRender } from '@tanstack/react-table'

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

import { MagnifyingGlassIcon } from '../icons'
import { getPinningStyles } from './data-table-utils'

const DataTableBody = <TData,>({
    rows,
    colCount,
    rowClassName,
    RowContextComponent,
    onRowClick,
    onDoubleClick,
}: {
    rows: Row<TData>[]
    colCount?: number
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
    return (
        <TableBody>
            {rows.map((row) => {
                const tableRow = (
                    <TableRow
                        className={cn('h-14', rowClassName)}
                        data-row-id={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        key={row.id}
                        onClick={(e) => onRowClick?.(row, e)}
                        onDoubleClick={(e) => onDoubleClick?.(row, e)}
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
                                    className="data-[pinned]:bg-muted/60 data-[pinned]:backdrop-blur-md [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&_*]:truncate"
                                    data-last-col={
                                        isLastLeftPinned
                                            ? 'left'
                                            : isFirstRightPinned
                                              ? 'right'
                                              : undefined
                                    }
                                    data-pinned={isPinned || undefined}
                                    key={cell.id}
                                    style={{
                                        ...getPinningStyles(column),
                                    }}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                )

                if (RowContextComponent)
                    return (
                        <RowContextComponent key={row.id} row={row}>
                            {tableRow}
                        </RowContextComponent>
                    )

                return tableRow
            })}
            {rows.length === 0 && (
                <TableRow>
                    <TableCell className="h-64" colSpan={colCount}>
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
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    )
}

export default DataTableBody
