import { cn } from '@/helpers/tw-utils'
import { HeaderGroup, flexRender } from '@tanstack/react-table'

import { getPinningStyles } from './data-table-utils'

const DataTableHeader = <TData,>({
    headerGroups,
    isStickyHeader = true,
}: {
    isStickyHeader?: boolean
    headerGroups: HeaderGroup<TData>[]
}) => (
    <thead
        className={cn(
            'bg-secondary dark:bg-popover',
            isStickyHeader && 'sticky top-0 z-50'
        )}
    >
        {headerGroups.map((headerGroup) => {
            return (
                <tr
                    className="flex w-full text-nowrap border-none"
                    key={headerGroup.id}
                >
                    {headerGroup.headers.map((header) => {
                        const { column } = header
                        const isPinned = column.getIsPinned()
                        const isLastLeftPinned =
                            isPinned === 'left' &&
                            column.getIsLastColumn('left')
                        const isFirstRightPinned =
                            isPinned === 'right' &&
                            column.getIsFirstColumn('right')

                        return (
                            <th
                                className={cn(
                                    'relative flex h-10 items-center border-b border-border bg-secondary px-2 text-left text-xs first:rounded-tl-lg last:rounded-tr-lg dark:bg-popover data-[pinned]:bg-muted/60 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border'
                                )}
                                colSpan={header.colSpan}
                                data-last-col={
                                    isLastLeftPinned
                                        ? 'left'
                                        : isFirstRightPinned
                                          ? 'right'
                                          : undefined
                                }
                                data-pinned={isPinned || undefined}
                                key={header.id}
                                style={{ ...getPinningStyles(column) }}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                      )}
                            </th>
                        )
                    })}
                </tr>
            )
        })}
    </thead>
)
export default DataTableHeader
