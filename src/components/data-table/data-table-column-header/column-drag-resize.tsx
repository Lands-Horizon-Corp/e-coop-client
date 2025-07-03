import { cn } from '@/lib'
import { Header, Table } from '@tanstack/react-table'

import { DragHandleIcon } from '@/components/icons'

interface Props<TData, TValue> {
    table: Table<TData>
    header: Header<TData, TValue>
}

const ColumnResizeHandle = <TData, TValue>({
    table,
    header,
}: Props<TData, TValue>) => {
    return (
        <div
            className={cn(
                'group absolute right-0 top-0 flex h-1/2 w-px translate-y-1/2 cursor-col-resize items-center justify-center bg-muted-foreground/30 duration-100 ease-in-out',
                header.column.getIsResizing() &&
                    'z-50 h-full translate-y-0 bg-foreground/80'
            )}
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            onDoubleClick={() => header.column.resetSize()}
            style={{
                transform:
                    table.options.columnResizeMode === 'onEnd' &&
                    header.column.getIsResizing()
                        ? `translateX(${
                              (table.options.columnResizeDirection === 'rtl'
                                  ? -1
                                  : 1) *
                              (table.getState().columnSizingInfo.deltaOffset ??
                                  0)
                          }px)`
                        : '',
            }}
        >
            <span
                className={cn(
                    'p-.5 w-px -translate-x-1.5 touch-none select-none rounded-sm bg-secondary/30 text-foreground/60 opacity-0 hover:bg-secondary/80 group-hover:opacity-100',
                    header.column.getIsResizing() &&
                        'bg-background text-foreground/80 opacity-100'
                )}
            >
                <DragHandleIcon className="size-3" />
            </span>
        </div>
    )
}

export default ColumnResizeHandle
