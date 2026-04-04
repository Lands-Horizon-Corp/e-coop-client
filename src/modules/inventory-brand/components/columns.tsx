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

import { IInventoryBrand } from '../inventory-brand.types'

export const inventoryBrandGlobalSearchTargets: IGlobalSearchTargets<IInventoryBrand>[] =
    [
        { field: 'name', displayText: 'Brand Name' },
        { field: 'description', displayText: 'Description' },
    ]

export interface IInventoryBrandTableActionComponentProp {
    row: Row<IInventoryBrand>
}

export interface IInventoryBrandTableColumnProps {
    actionComponent?: (
        props: IInventoryBrandTableActionComponentProp
    ) => React.ReactNode
}

const InventoryBrandTableColumns = (
    opts?: IInventoryBrandTableColumnProps
): ColumnDef<IInventoryBrand>[] => [
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
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                />
            </div>
        ),
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 80,
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Brand">
                <ColumnActions {...props}>
                    <TextFilter<IInventoryBrand>
                        displayText="Brand Name"
                        field="name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="flex items-center gap-3 min-w-0">
                <PreviewMediaWrapper media={original.media}>
                    <ImageDisplay
                        className="h-9 w-9 rounded-full border bg-muted object-cover"
                        src={original.media?.download_url}
                    />
                </PreviewMediaWrapper>
                <div className="flex flex-col min-w-0">
                    <span className="font-semibold truncate">
                        {original.name || '-'}
                    </span>
                    {original.icon && (
                        <span className="text-xs text-muted-foreground">
                            {original.icon}
                        </span>
                    )}
                </div>
            </div>
        ),
        enableSorting: true,
        size: 220,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IInventoryBrand>
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
        size: 200,
    },
    ...createUpdateColumns<IInventoryBrand>(),
]

export default InventoryBrandTableColumns
