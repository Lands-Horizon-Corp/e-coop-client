import { cn } from '@/lib'
import { Table, flexRender } from '@tanstack/react-table'

import { TableCell, TableFooter, TableRow } from '@/components/ui/table'

import { getPinningStyles } from './data-table-utils'

const DataTableFooter = <TData,>({
    table,
    footerTrClassName,
    isStickyFooter = false,
}: {
    table: Table<TData>
    footerTrClassName?: string
    isStickyFooter?: boolean
}) => {
    const hasFooters = table
        .getFooterGroups()
        .some((group) =>
            group.headers.some((header) => header.column.columnDef.footer)
        )

    if (!hasFooters) return null

    return (
        <TableFooter
            className={cn('', isStickyFooter && 'sticky bottom-0 z-50')}
        >
            {table.getFooterGroups().map((footerGroup) => (
                <TableRow
                    key={footerGroup.id}
                    data-footer-row-id={footerGroup.id}
                    className={cn(
                        'text-nowrap bg-secondary hover:bg-popover dark:bg-popover',
                        footerTrClassName
                    )}
                >
                    {footerGroup.headers.map((header) => {
                        const { column } = header
                        const isPinned = column.getIsPinned()
                        const isLastLeftPinned =
                            isPinned === 'left' &&
                            column.getIsLastColumn('left')
                        const isFirstRightPinned =
                            isPinned === 'right' &&
                            column.getIsFirstColumn('right')

                        return (
                            <TableCell
                                key={header.id}
                                className="size-fit text-nowrap font-medium data-[pinned]:bg-muted/60 data-[pinned]:backdrop-blur-sm [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border"
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
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.footer,
                                          header.getContext()
                                      )}
                            </TableCell>
                        )
                    })}
                </TableRow>
            ))}
        </TableFooter>
    )
}

export default DataTableFooter
