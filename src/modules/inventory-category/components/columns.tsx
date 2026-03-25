import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon, RenderIcon, TIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IInventoryCategory } from '../inventory-category.types'

export const inventoryCategoryGlobalSearchTargets: IGlobalSearchTargets<IInventoryCategory>[] =
    [{ field: 'name', displayText: 'Category Name' }]

export interface IInventoryCategoryTableActionComponentProp {
    row: Row<IInventoryCategory>
}

export interface IInventoryCategoryTableColumnProps {
    actionComponent?: (
        props: IInventoryCategoryTableActionComponentProp
    ) => React.ReactNode
}

const InventoryCategoryTableColumns = (
    opts?: IInventoryCategoryTableColumnProps
): ColumnDef<IInventoryCategory>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className="flex items-center px-2 gap-1">
                <HeaderToggleSelect table={table} />
                {!column.getIsPinned() && (
                    <PushPinSlashIcon
                        className="size-3.5 cursor-pointer"
                        onClick={() => column.pin('left')}
                    />
                )}
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                {opts?.actionComponent?.({ row })}
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                />
            </div>
        ),
        enableSorting: false,
        size: 80,
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Category">
                <ColumnActions {...props}>
                    <TextFilter displayText="Category Name" field="name" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => {
            const icon = row.original.icon
            return (
                <div className="font-medium flex items-center text-gray-600 dark:text-gray-400">
                    {icon && icon.length > 0 && (
                        <span className="mr-2">
                            <RenderIcon icon={icon as TIcon} />
                        </span>
                    )}
                    {row.original.name}
                </div>
            )
        },
        size: 250,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description" />
        ),
        cell: ({ row }) => (
            <div className="truncate max-w-[300px]">
                {row.original.description || '-'}
            </div>
        ),
        size: 300,
    },
    ...createUpdateColumns<IInventoryCategory>(),
]

export default InventoryCategoryTableColumns
