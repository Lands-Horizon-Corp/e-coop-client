import { currencyFormat } from '@/modules/currency'
import { IOtherFund } from '@/modules/other-fund'
// Assuming this is the path
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'

import OtherFundStatusIndicator from '../other-fund-status-indicatior'

export const otherFundGlobalSearchTargets: IGlobalSearchTargets<IOtherFund>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'cash_voucher_number', displayText: 'Voucher Number' },
        { field: 'description', displayText: 'Description' },
        { field: 'reference', displayText: 'Reference' },
        { field: 'status', displayText: 'Status' },
    ]

export interface IOtherFundTableActionComponentProp {
    row: Row<IOtherFund>
}

export interface IOtherFundTableColumnProps {
    actionComponent?: (
        props: IOtherFundTableActionComponentProp
    ) => React.ReactNode
}

const OtherFundTableColumns = (
    opts?: IOtherFundTableColumnProps
): ColumnDef<IOtherFund>[] => [
    {
        id: 'select',
        cell: ({ row }) => (
            <div className="flex w-fit items-center gap-x-1 px-0">
                {opts?.actionComponent?.({ row })}
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
            <DataTableColumnHeader {...props} title="Name">
                <ColumnActions {...props}>
                    <TextFilter<IOtherFund>
                        defaultMode="contains"
                        displayText="Name"
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
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-medium">
                    {name || '-'}
                </span>
            </div>
        ),
    },
    {
        id: 'cash_voucher_number',
        accessorKey: 'cash_voucher_number',
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
        size: 200,
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
            <div className="text-xs">
                {date ? new Date(date).toLocaleDateString() : '-'}
            </div>
        ),
        size: 120,
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: (props) => <DataTableColumnHeader {...props} title="Status" />,
        cell: ({ row: { original: otherFund } }) => (
            <OtherFundStatusIndicator
                className="max-w-max"
                otherFund={otherFund}
            />
        ),
        size: 120,
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
            <div className="text-xs font-mono">
                {currencyFormat(total_debit, {
                    currency: currency,
                    showSymbol: !!currency,
                })}
            </div>
        ),
        size: 150,
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
            <div className="text-xs font-mono">
                {currencyFormat(total_credit, {
                    currency: currency,
                    showSymbol: !!currency,
                })}
            </div>
        ),
        size: 150,
    },
    {
        id: 'posted_by',
        accessorKey: 'posted_by',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Posted By" />
        ),
        cell: ({
            row: {
                original: { posted_by },
            },
        }) => (
            <div className="truncate text-xs">
                {posted_by?.first_name ?? '-'}
            </div>
        ),
        size: 150,
    },
    // Includes standard created_at, updated_at columns
    ...createUpdateColumns<IOtherFund>(),
]

export default OtherFundTableColumns
