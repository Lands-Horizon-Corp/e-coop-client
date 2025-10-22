import { currencyFormat } from '@/modules/currency'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { ICashCheckVoucher } from '../../cash-check-voucher.types'
import CashCheckVoucherStatusIndicator from '../cash-check-status-indicator'

export const cashCheckVoucherGlobalSearchTargets: IGlobalSearchTargets<ICashCheckVoucher>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'cash_voucher_number', displayText: 'Cash Voucher Number' },
        { field: 'description', displayText: 'Description' },
        { field: 'status', displayText: 'Status' },
    ]

export interface ICashCheckVoucherTableActionComponentProp {
    row: Row<ICashCheckVoucher>
}

export interface ICashCheckVoucherTableColumnProps {
    actionComponent?: (
        props: ICashCheckVoucherTableActionComponentProp
    ) => React.ReactNode
}

const CashCheckVoucherTableColumns = (
    opts?: ICashCheckVoucherTableColumnProps
): ColumnDef<ICashCheckVoucher>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className={'flex w-fit items-center gap-x-1 px-2'}>
                <HeaderToggleSelect table={table} />
                {!column.getIsPinned() && (
                    <PushPinIcon
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
        id: 'voucher_number',
        accessorKey: 'voucher_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Voucher Number" />
        ),
        cell: ({
            row: {
                original: { cash_voucher_number },
            },
        }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs text-muted-foreground/70">
                    {cash_voucher_number || '-'}
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
        id: 'name',
        accessorKey: 'name',
        header: (props) => <DataTableColumnHeader {...props} title="Name" />,
        cell: ({
            row: {
                original: { name },
            },
        }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs text-muted-foreground/70">
                    {name || '-'}
                </span>
            </div>
        ),
        size: 320,
        minSize: 250,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description" />
        ),
        cell: ({
            row: {
                original: { description },
            },
        }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs text-muted-foreground/70">
                    {description || '-'}
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
        id: 'date',
        accessorKey: 'date',
        header: (props) => <DataTableColumnHeader {...props} title="Date" />,
        cell: ({
            row: {
                original: { date },
            },
        }) => (
            <div className="!text-wrap">
                {date ? new Date(date).toLocaleDateString() : '-'}
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
        id: 'total_debit',
        accessorKey: 'total_debit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Total Debit" />
        ),
        cell: ({
            row: {
                original: { total_debit, currency },
            },
        }) => (
            <div className="!text-wrap">
                {currencyFormat(total_debit, {
                    currency,
                    showSymbol: !!currency,
                })}
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
        id: 'total_credit',
        accessorKey: 'total_credit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Total Credit" />
        ),
        cell: ({
            row: {
                original: { total_credit, currency },
            },
        }) => (
            <div className="!text-wrap">
                {currencyFormat(total_credit, {
                    currency,
                    showSymbol: !!currency,
                })}
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
        id: 'action-status',
        accessorKey: 'action-status',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Action Status" />
        ),
        cell: ({ row: { original: cashCheckVoucher } }) => {
            return (
                <CashCheckVoucherStatusIndicator
                    cashCheckVoucher={cashCheckVoucher}
                    className="max-w-max"
                />
            )
        },
        size: 150,
        minSize: 120,
    },
    {
        id: 'released_by',
        accessorKey: 'released_by',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Released By" />
        ),
        cell: ({
            row: {
                original: { released_by },
            },
        }) => (
            <div className="!text-wrap">{released_by?.first_name ?? '-'}</div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 120,
    },
    ...createUpdateColumns<ICashCheckVoucher>(),
]

export default CashCheckVoucherTableColumns
