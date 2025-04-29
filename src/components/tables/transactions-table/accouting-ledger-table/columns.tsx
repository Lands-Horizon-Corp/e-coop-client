import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'
import { IAccountingLedgerResource } from '@/types/coop-types/accounts/accounting-ledger'

export const accountingLedgerGlobalSearchTargets: IGlobalSearchTargets<IAccountingLedgerResource>[] =
    [
        { field: 'description', displayText: 'Description' },
        { field: 'orNumber', displayText: 'OR Number' },
        { field: 'transactionSource', displayText: 'Transaction Source' },
        { field: 'debit', displayText: 'Debit' },
        { field: 'credit', displayText: 'Credit' },
        { field: 'balance', displayText: 'Balance' },
    ]

export interface IAccountingLedgerTableActionComponentProp {
    row: Row<IAccountingLedgerResource>
}

export interface IAccountingLedgerTableColumnProps {
    actionComponent?: (
        props: IAccountingLedgerTableActionComponentProp
    ) => ReactNode
}

const accountingLedgerTableColumns =
    (): ColumnDef<IAccountingLedgerResource>[] => {
        return [
            {
                id: 'description',
                accessorKey: 'description',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Account title">
                        <ColumnActions {...props}>
                            <TextFilter
                                displayText="Account title"
                                field="description"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.description}</div>
                ),
                size: 160,
                maxSize: 250,
                minSize: 160,
                enableHiding: false,
                enablePinning: false,
                enableSorting: false,
                enableMultiSort: true,
                enableResizing: false,
            },
            {
                id: 'orNumber',
                accessorKey: 'orNumber',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="OR Number">
                        <ColumnActions {...props}>
                            <TextFilter
                                displayText="OR Number"
                                field="orNumber"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => <div>{original.orNumber}</div>,
                enableMultiSort: true,
                maxSize: 250,
                minSize: 160,
            },
            {
                id: 'transactionDate',
                accessorKey: 'transactionDate',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Transaction Date">
                        <ColumnActions {...props}>
                            <DateFilter
                                displayText="Transaction Date"
                                field="transactionDate"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{toReadableDate(original.transactionDate)}</div>
                ),
                enableMultiSort: true,
                maxSize: 250,
                minSize: 200,
            },
            {
                id: 'debit',
                accessorKey: 'debit',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Debit">
                        <ColumnActions {...props}>
                            <TextFilter displayText="Debit" field="debit" />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => <div>{original.debit}</div>,
                enableMultiSort: true,
                size: 280,
                maxSize: 500,
                minSize: 200,
            },
            {
                id: 'credit',
                accessorKey: 'credit',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Credit">
                        <ColumnActions {...props}>
                            <TextFilter displayText="Credit" field="credit" />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => <div>{original.credit}</div>,
                enableMultiSort: true,
                size: 280,
                maxSize: 500,
                minSize: 200,
            },
            {
                id: 'balance',
                accessorKey: 'balance',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Balance">
                        <ColumnActions {...props}>
                            <TextFilter displayText="Balance" field="balance" />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.summary.balance}</div>
                ),
                enableMultiSort: true,
                enableResizing: false,
                enableSorting: true,
                enableHiding: false,
                size: 160,
                minSize: 160,
                maxSize: 500,
            },
            {
                id: 'transactionSource',
                accessorKey: 'transactionSource',
                header: (props) => (
                    <DataTableColumnHeader
                        {...props}
                        title="Transaction Source"
                    >
                        <ColumnActions {...props}>
                            <TextFilter
                                displayText="Transaction Source"
                                field="transactionSource"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.transactionSource}</div>
                ),
                enableMultiSort: true,
                size: 250,
                maxSize: 500,
                minSize: 250,
            },
            {
                id: 'createdAt',
                accessorKey: 'createdAt',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Created At">
                        <ColumnActions {...props}>
                            <DateFilter
                                displayText="Created At"
                                field="createdAt"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{toReadableDate(original.createdAt)}</div>
                ),
                enableMultiSort: true,
                minSize: 150,
                maxSize: 200,
            },
        ]
    }

export default accountingLedgerTableColumns
