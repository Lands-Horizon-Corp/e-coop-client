import { ColumnDef, Row } from '@tanstack/react-table'
import { format } from 'date-fns'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { ICancelledCashCheckVoucher } from '../../cancelled-cash-check-voucher.types'

export const cancelledCashCheckVoucherGlobalSearchTargets: IGlobalSearchTargets<ICancelledCashCheckVoucher>[] =
    [
        { field: 'check_number', displayText: 'Check Number' },
        { field: 'description', displayText: 'Description' },
    ]
export interface ICancelledCashCheckVoucherTableActionComponentProp {
    row: Row<ICancelledCashCheckVoucher>
}

export interface ICancelledCashCheckVoucherTableColumnProps {
    actionComponent?: (
        props: ICancelledCashCheckVoucherTableActionComponentProp
    ) => React.ReactNode
}
const CancelledCashCheckVoucherTableColumns = (
    opts?: ICancelledCashCheckVoucherTableColumnProps
): ColumnDef<ICancelledCashCheckVoucher>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className={'flex w-fit items-center gap-x-1 px-2'}>
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
        id: 'check_number',
        accessorKey: 'check_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Check Number">
                <ColumnActions {...props}>
                    <TextFilter<ICancelledCashCheckVoucher>
                        displayText="Check Number"
                        field="check_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { check_number },
            },
        }) => <span className="font-medium">{check_number || '-'}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 150,
    },
    {
        id: 'entry_date',
        accessorKey: 'entry_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Entry Date" />
        ),
        cell: ({
            row: {
                original: { entry_date },
            },
        }) => (
            <span>
                {entry_date
                    ? format(new Date(entry_date), 'MMM dd, yyyy')
                    : '-'}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 120,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<ICancelledCashCheckVoucher>
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
        }) => <div className="!text-wrap">{description || '-'}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 250,
        minSize: 200,
    },

    ...createUpdateColumns<ICancelledCashCheckVoucher>(),
]

export default CancelledCashCheckVoucherTableColumns
