import { cn } from '@/lib'
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { HeaderGroup, flexRender } from '@tanstack/react-table'

import { TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { getPinningStyles } from './data-table-utils'

const DataTableHeader = <TData,>({
    columnOrder,
    headerGroups,
    isStickyHeader = true,
}: {
    columnOrder: string[]
    isStickyHeader?: boolean
    headerGroups: HeaderGroup<TData>[]
}) => (
    <TableHeader className={cn('', isStickyHeader && 'sticky top-0 z-50')}>
        {headerGroups.map((headerGroup) => {
            return (
                <TableRow
                    key={headerGroup.id}
                    className="text-nowrap !border-none bg-secondary first:rounded-t-xl dark:bg-popover"
                >
                    <SortableContext
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
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
                                <TableHead
                                    key={header.id}
                                    className={cn(
                                        'relative h-10 border-y text-xs first:rounded-tl-lg last:rounded-tr-lg data-[pinned]:bg-muted/50 data-[pinned]:backdrop-blur-md [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border'
                                    )}
                                    colSpan={header.colSpan}
                                    style={{ ...getPinningStyles(column) }}
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
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            )
                        })}
                    </SortableContext>
                </TableRow>
            )
        })}
    </TableHeader>
)
export default DataTableHeader
