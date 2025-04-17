import { CSSProperties } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Column, Header, Table } from '@tanstack/react-table'

import ColumnResizeHandle from './column-drag-resize'
import ActionTooltip from '@/components/action-tooltip'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PushPinSlashIcon } from '@/components/icons'

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    table: Table<TData>
    tooltipDescription?: string
    column: Column<TData, TValue>
    header: Header<TData, TValue>
}

const DataTableColumnHeader = <TData, TValue>({
    title,
    table,
    header,
    children,
    className,
    tooltipDescription,
}: DataTableColumnHeaderProps<TData, TValue>) => {
    const { attributes, isDragging, listeners, setNodeRef, transform } =
        useSortable({
            id: header.column.id,
        })

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition: 'width transform 0.2s ease-in-out',
        whiteSpace: 'nowrap',
        width: header.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    }

    const finalTitle = tooltipDescription ? (
        <ActionTooltip tooltipContent={tooltipDescription ?? ''}>
            <span className="relative font-bold">{title}</span>
        </ActionTooltip>
    ) : (
        <span className="relative font-bold">{title}</span>
    )

    return (
        <div className="inline-block w-full flex-1 space-y-1 py-2">
            <div className={cn('flex w-full items-center gap-x-2', className)}>
                <div className="inline-flex w-full items-center justify-between gap-x-0.5">
                    <span
                        // size="sm"
                        style={style}
                        {...listeners}
                        // variant="ghost"
                        {...attributes}
                        ref={setNodeRef}
                        className="!size-fit cursor-ew-resize gap-x-2 self-start truncate p-1"
                    >
                        {finalTitle}
                    </span>
                    <div className="flex items-center gap-x-2">
                        {children}
                        {header.column.getCanPin() &&
                            header.column.getIsPinned() && (
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="size-fit rounded-md p-1"
                                    onClick={() => header.column.pin(false)}
                                >
                                    <PushPinSlashIcon className="size-3.5" />
                                </Button>
                            )}
                        {header.column.getCanResize() && (
                            <ColumnResizeHandle table={table} header={header} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataTableColumnHeader
