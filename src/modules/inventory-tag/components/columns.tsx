import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IInventoryTag } from '../inventory-tag.types'

export const inventoryTagGlobalSearchTargets: IGlobalSearchTargets<IInventoryTag>[] =
    [
        { field: 'name', displayText: 'Tag Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'category', displayText: 'Category' },
    ]

export interface IInventoryTagTableActionComponentProp {
    row: Row<IInventoryTag>
}

export interface IInventoryTagTableColumnProps {
    actionComponent?: (
        props: IInventoryTagTableActionComponentProp
    ) => React.ReactNode
}

const InventoryTagTableColumns = (
    opts?: IInventoryTagTableColumnProps
): ColumnDef<IInventoryTag>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className="flex w-fit items-center gap-x-1 px-2">
                <HeaderToggleSelect table={table} />
                {!column.getIsPinned() && (
                    <PushPinSlashIcon
                        className="mr-2 size-3.5 cursor-pointer"
                        onClick={() => column.pin('left')}
                    />
                )}
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex w-fit items-center gap-x-1 px-0">
                {opts?.actionComponent?.({ row })}
                <Checkbox
                    aria-label="Select row"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            </div>
        ),
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 80,
        minSize: 80,
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Tag">
                <ColumnActions {...props}>
                    <TextFilter<IInventoryTag>
                        displayText="Tag Name"
                        field="name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { name, color, icon },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: color || '#ccc' }}
                />
                {icon && (
                    <span className="text-xs text-muted-foreground">
                        {icon}
                    </span>
                )}
                <span className="truncate font-semibold">{name || '-'}</span>
            </div>
        ),
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 220,
        minSize: 180,
    },
    {
        id: 'category',
        accessorKey: 'category',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Category">
                <ColumnActions {...props}>
                    <TextFilter<IInventoryTag>
                        displayText="Category"
                        field="category"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => {
            const category = row.original.category

            return <div className="capitalize text-sm">{category || '-'}</div>
        },
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 140,
        minSize: 120,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IInventoryTag>
                        displayText="Description"
                        field="description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div className="text-wrap!">{row.original.description || '-'}</div>
        ),
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 200,
        minSize: 160,
    },
    {
        id: 'inventory_item',
        accessorKey: 'inventory_id',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Inventory Item" />
        ),
        cell: ({ row }) => {
            const item = row.original.inventory_id

            return (
                <div className="truncate text-sm">
                    {item?.name || item?.id || '-'}
                </div>
            )
        },
        enableSorting: false,
        enableResizing: true,
        enableHiding: false,
        size: 200,
        minSize: 160,
    },
    ...createUpdateColumns<IInventoryTag>(),
]

export default InventoryTagTableColumns
