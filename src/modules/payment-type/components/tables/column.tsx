import { toReadableDate } from '@/helpers/date-utils'
import { IPaymentType } from '@/modules/payment-type'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

export const PaymentTypeGlobalSearchTargets: IGlobalSearchTargets<IPaymentType>[] =
    [
        { field: 'name', displayText: 'Payment Type Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'type', displayText: 'Type' },
    ]

export interface IPaymentTypeTableActionComponentProp {
    row: Row<IPaymentType>
}

export interface IPaymentTypeTableColumnProps {
    actionComponent?: (
        props: IPaymentTypeTableActionComponentProp
    ) => React.ReactNode
}

export const PaymentTypeTableColumns = (
    opts?: IPaymentTypeTableColumnProps
): ColumnDef<IPaymentType>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className={'flex w-fit items-center gap-x-1 px-2'}>
                <HeaderToggleSelect table={table} />
                {!column.getIsPinned() && (
                    <PushPinSlashIcon
                        onClick={() => column.pin('left')}
                        className="mr-2 size-3.5 cursor-pointer"
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
            <DataTableColumnHeader {...props} title="Payment Type Name">
                <ColumnActions {...props}>
                    <TextFilter<IPaymentType>
                        displayText="Payment Type Name"
                        field="name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { name },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                <span className="truncate text-xs text-muted-foreground/70">
                    {name || '-'}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 220,
        minSize: 180,
    },
    {
        id: 'type',
        accessorKey: 'type',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Type">
                <ColumnActions {...props}>
                    <TextFilter<IPaymentType> displayText="Type" field="type" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { type },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                <span className="truncate text-xs text-muted-foreground/70">
                    {type ? type.charAt(0).toUpperCase() + type.slice(1) : '-'}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 120,
    },
    {
        id: 'number_of_days',
        accessorKey: 'number_of_days',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Days">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { number_of_days },
            },
        }) => (
            <span className="text-sm font-semibold">
                {typeof number_of_days === 'number' ? number_of_days : '-'}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 100,
        minSize: 80,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IPaymentType>
                        displayText="Description"
                        field="description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { description },
            },
        }) => <div>{description || '-'}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 180,
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { created_at },
            },
        }) => (
            <span className="text-sm font-semibold">
                {created_at ? toReadableDate(created_at) : '-'}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 150,
    },
]
export default PaymentTypeTableColumns
