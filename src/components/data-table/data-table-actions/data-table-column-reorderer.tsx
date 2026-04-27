import { useCallback, useEffect, useMemo, useState } from 'react'

import { cn } from '@/helpers'
import {
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Table } from '@tanstack/react-table'

import {
    ColumnOutlineIcon,
    GripVerticalIcon,
    RefreshIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

export interface DataTableColumnOrderProps<TData> {
    table: Table<TData>
    className?: string
    labels?: Record<string, string>
}

interface SortableItemProps {
    id: string
    label: string
    index: number
}

const SortableItem = ({ id, label, index }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            className={cn(
                'flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-sm',
                'hover:bg-accent/50 transition-colors',
                isDragging &&
                    'opacity-60 shadow-lg ring-1 ring-ring z-10 relative'
            )}
            ref={setNodeRef}
            style={style}
        >
            <button
                className="cursor-grab active:cursor-grabbing touch-none p-1 text-muted-foreground hover:text-foreground"
                type="button"
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${label}`}
            >
                <GripVerticalIcon className="size-4" />
            </button>
            <span className="text-muted-foreground tabular-nums text-xs w-5 text-right">
                {index + 1}.
            </span>
            <span className="flex-1 truncate">{label}</span>
        </div>
    )
}

export const DataTableColumnReorder = <TData,>({
    table,
    className,
    labels,
}: DataTableColumnOrderProps<TData>) => {
    const [open, setOpen] = useState(false)

    const columnOrder = table.getState().columnOrder
    const allLeafColumns = table.getAllLeafColumns()

    const derivedOrder = useMemo(() => {
        if (columnOrder?.length) return columnOrder
        return allLeafColumns.map((col) => col.id)
    }, [columnOrder, allLeafColumns])

    const [order, setOrder] = useState<string[]>(derivedOrder)
    const [initialOrder, setInitialOrder] = useState<string[]>(derivedOrder)

    useEffect(() => {
        if (!open) {
            setOrder(derivedOrder)
            setInitialOrder(derivedOrder)
        }
    }, [derivedOrder, open])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        setOrder((items) => {
            const oldIndex = items.indexOf(active.id as string)
            const newIndex = items.indexOf(over.id as string)
            if (oldIndex === -1 || newIndex === -1) return items
            return arrayMove(items, oldIndex, newIndex)
        })
    }, [])

    const handleApply = () => {
        table.setColumnOrder(order)
        setInitialOrder(order)
        // setOpen(false)
    }

    const handleReset = () => {
        setOrder(initialOrder)
    }

    const isDirty =
        order.length !== initialOrder.length ||
        order.some((id, i) => id !== initialOrder[i])

    return (
        <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    className={cn('rounded-md', className)}
                    size="icon"
                    variant="secondary"
                >
                    <ColumnOutlineIcon className="size-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-72 rounded-xl overflow-clip p-0"
            >
                <div className="flex items-center justify-between px-3 py-2 border-b">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <ColumnOutlineIcon className="size-4" />
                        Reorder columns
                    </div>
                    <Button
                        className="h-7 px-2 text-xs"
                        disabled={!isDirty}
                        onClick={handleReset}
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        <RefreshIcon className="size-3" />
                        Reset
                    </Button>
                </div>
                <div className="max-h-[50vh] ecoop-scroll overflow-x-clip overflow-y-auto p-2">
                    {order.length === 0 ? (
                        <p className="text-sm text-muted-foreground px-2 py-6 text-center">
                            No columns to reorder
                        </p>
                    ) : (
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            sensors={sensors}
                        >
                            <SortableContext
                                items={order}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex flex-col gap-1">
                                    {order.map((id, index) => (
                                        <SortableItem
                                            id={id}
                                            index={index}
                                            key={id}
                                            label={labels?.[id] ?? id}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                <div className="sticky bottom-0 flex items-center justify-end gap-2 px-3 py-2 border-t bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/80 rounded-b-md">
                    <Button
                        onClick={() => setOpen(false)}
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!isDirty}
                        onClick={handleApply}
                        size="sm"
                        type="button"
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DataTableColumnReorder
