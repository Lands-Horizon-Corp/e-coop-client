import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Checkbox } from '@/components/ui/checkbox'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IInventoryInternalWarehouse } from '../inventory-warehouse.types'

export const inventoryWarehouseGlobalSearchTargets: IGlobalSearchTargets<IInventoryInternalWarehouse>[] =
    [
        { field: 'name', displayText: 'Warehouse Name' },
        { field: 'code', displayText: 'Code' },
        { field: 'address', displayText: 'Address' },
    ]

export interface IInventoryWarehouseTableActionComponentProp {
    row: Row<IInventoryInternalWarehouse>
}

export interface IInventoryWarehouseTableColumnProps {
    actionComponent?: (
        props: IInventoryWarehouseTableActionComponentProp
    ) => React.ReactNode
}

const InventoryWarehouseTableColumns = (
    opts?: IInventoryWarehouseTableColumnProps
): ColumnDef<IInventoryInternalWarehouse>[] => [
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
            <DataTableColumnHeader {...props} title="Warehouse">
                <ColumnActions {...props}>
                    <TextFilter displayText="Warehouse Name" field="name" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => {
            const w = row.original
            return (
                <div className="flex items-center gap-3">
                    <PreviewMediaWrapper media={w.media}>
                        <ImageDisplay
                            className="h-9 w-9 rounded border"
                            src={w.media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <div>
                        <div className="font-semibold">{w.name}</div>
                        <div className="text-xs text-muted-foreground">
                            {w.code}
                        </div>
                    </div>
                </div>
            )
        },
        size: 220,
    },
    {
        id: 'type',
        accessorKey: 'type',
        header: (props) => <DataTableColumnHeader {...props} title="Type" />,
        cell: ({ row }) => (
            <div className="capitalize">{row.original.type}</div>
        ),
        size: 120,
    },
    {
        id: 'address',
        accessorKey: 'address',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Address">
                <ColumnActions {...props}>
                    <TextFilter displayText="Address" field="address" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.address || '-'}</div>,
        size: 200,
    },
    ...createUpdateColumns<IInventoryInternalWarehouse>(),
]

export default InventoryWarehouseTableColumns
