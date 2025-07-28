import { cn } from '@/lib'
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import { Row, Table as TableInstance } from '@tanstack/react-table'

import { IClassProps } from '@/types'

import { Table } from '../ui/table'
import DataTableBody from './data-table-body'
import DataTableFooter from './data-table-footer'
import DataTableHeader from './data-table-header'

interface ITableProps<TData> extends IClassProps {
    table: TableInstance<TData>
    rowClassName?: string
    isScrollable?: boolean
    isStaticWidth?: boolean
    isStickyHeader?: boolean
    isStickyFooter?: boolean
    onRowClick?: (row: Row<TData>) => void
    setColumnOrder?: React.Dispatch<React.SetStateAction<string[]>>
}

const DataTable = <TData,>({
    table,
    className,
    rowClassName,
    isScrollable,
    isStickyHeader,
    isStickyFooter,
    isStaticWidth = false,
    setColumnOrder,
    onRowClick = (row) => {
        row.toggleSelected()
    },
}: ITableProps<TData>) => {
    const handleDragEnd = (event: DragEndEvent) => {
        if (!setColumnOrder) return

        const { active, over } = event

        if (active && over && active.id !== over.id) {
            setColumnOrder((columnOrder) => {
                const oldIndex = columnOrder.indexOf(active.id as string)
                const newIndex = columnOrder.indexOf(over.id as string)
                return arrayMove(columnOrder, oldIndex, newIndex)
            })
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
        >
            <Table
                wrapperClassName={cn(
                    'ecoop-scroll bg-popover ring-offset-0 shadow dark:bg-secondary/10 rounded-lg -z-0',
                    className,
                    !isScrollable ? 'h-fit max-h-none min-h-fit' : 'h-full grow'
                )}
                className="table-fixed border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none"
                style={
                    isStaticWidth
                        ? {
                              width: table.getTotalSize(),
                          }
                        : {}
                }
            >
                <DataTableHeader
                    isStickyHeader={isStickyHeader}
                    columnOrder={table.getState().columnOrder}
                    headerGroups={table.getHeaderGroups()}
                />
                <DataTableBody
                    rowClassName={rowClassName}
                    onRowClick={onRowClick}
                    rows={table.getRowModel().rows}
                    colCount={table.getVisibleLeafColumns().length}
                />
                <DataTableFooter
                    table={table}
                    isStickyFooter={isStickyFooter && isScrollable}
                />
            </Table>
        </DndContext>
    )
}

export default DataTable
