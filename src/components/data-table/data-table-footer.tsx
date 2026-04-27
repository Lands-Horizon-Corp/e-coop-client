import { cn } from '@/helpers/tw-utils'
import { Table, flexRender } from '@tanstack/react-table'

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
        <tfoot className={cn('', isStickyFooter && 'sticky bottom-0 z-50')}>
            {table.getFooterGroups().map((footerGroup) => (
                <tr
                    className={cn(
                        'flex w-full text-nowrap bg-secondary dark:bg-popover',
                        footerTrClassName
                    )}
                    data-footer-row-id={footerGroup.id}
                    key={footerGroup.id}
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
                            <td
                                className="truncate border-t border-border bg-secondary px-3 py-2 text-nowrap text-sm font-medium dark:bg-popover data-[pinned]:bg-muted/60 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border"
                                data-last-col={
                                    isLastLeftPinned
                                        ? 'left'
                                        : isFirstRightPinned
                                          ? 'right'
                                          : undefined
                                }
                                data-pinned={isPinned || undefined}
                                key={header.id}
                                style={{
                                    ...getPinningStyles(column),
                                }}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.footer,
                                          header.getContext()
                                      )}
                            </td>
                        )
                    })}
                </tr>
            ))}
        </tfoot>
    )
}

export default DataTableFooter
