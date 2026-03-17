import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon, RenderIcon, TIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IInventoryHazard } from '../inventory-hazard.types'

export const inventoryHazardGlobalSearchTargets: IGlobalSearchTargets<IInventoryHazard>[] =
    [{ field: 'name', displayText: 'Hazard Name' }]

export interface IInventoryHazardTableActionComponentProp {
    row: Row<IInventoryHazard>
}

export interface IInventoryHazardTableColumnProps {
    actionComponent?: (
        props: IInventoryHazardTableActionComponentProp
    ) => React.ReactNode
}

const InventoryHazardTableColumns = (
    opts?: IInventoryHazardTableColumnProps
): ColumnDef<IInventoryHazard>[] => [
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
            <DataTableColumnHeader {...props} title="Hazard Name">
                <ColumnActions {...props}>
                    <TextFilter displayText="Hazard Name" field="name" />
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
            <DataTableColumnHeader {...props} title="Safety Description" />
        ),
        cell: ({ row }) => (
            <div className="truncate max-w-[400px] text-muted-foreground">
                {row.original.description || '-'}
            </div>
        ),
        size: 400,
    },
    ...createUpdateColumns<IInventoryHazard>(),
]

export default InventoryHazardTableColumns
