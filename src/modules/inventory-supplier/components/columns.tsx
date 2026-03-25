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

import { IInventorySupplier } from '../inventory-supplier.types'

export const inventorySupplierGlobalSearchTargets: IGlobalSearchTargets<IInventorySupplier>[] =
    [
        { field: 'name', displayText: 'Supplier Name' },
        { field: 'contact_number', displayText: 'Contact Number' },
        { field: 'address', displayText: 'Address' },
    ]

export interface IInventorySupplierTableActionComponentProp {
    row: Row<IInventorySupplier>
}

export interface IInventorySupplierTableColumnProps {
    actionComponent?: (
        props: IInventorySupplierTableActionComponentProp
    ) => React.ReactNode
}

const InventorySupplierTableColumns = (
    opts?: IInventorySupplierTableColumnProps
): ColumnDef<IInventorySupplier>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className="flex items-center gap-1 px-2">
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
            <DataTableColumnHeader {...props} title="Supplier">
                <ColumnActions {...props}>
                    <TextFilter displayText="Supplier Name" field="name" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => {
            const s = row.original
            return (
                <div className="flex items-center gap-3">
                    <PreviewMediaWrapper media={s.media}>
                        <ImageDisplay
                            className="h-9 w-9 rounded-full border"
                            src={s.media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-muted-foreground">
                            {s.contact_number}
                        </div>
                    </div>
                </div>
            )
        },
        size: 220,
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
    ...createUpdateColumns<IInventorySupplier>(),
]

export default InventorySupplierTableColumns
