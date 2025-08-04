import { ReactNode } from 'react'

import { ITransaction } from '@/types/coop-types/transaction'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { createUpdateColumns } from '../common-columns'

export const transactionGlobalSearchTargets: IGlobalSearchTargets<ITransaction>[] =
    [
        { field: 'reference_number', displayText: 'Reference Number' },
        {
            field: 'transaction_reference_number',
            displayText: 'Transaction Reference',
        },
        { field: 'source', displayText: 'Source' },
        { field: 'description', displayText: 'Description' },
        { field: 'transaction_batch_id', displayText: 'Batch ID' },
    ]

export interface ITransactionTableActionComponentProp {
    row: Row<ITransaction>
}

export interface ITransactionTableColumnProps {
    hideSelect?: boolean
    actionComponent?: (props: ITransactionTableActionComponentProp) => ReactNode
}

const TransactionTableColumns = (
    opts?: ITransactionTableColumnProps
): ColumnDef<ITransaction>[] => {
    const columns: ColumnDef<ITransaction>[] = [
        {
            id: 'reference_number',
            accessorKey: 'reference_number',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Reference Number">
                    <ColumnActions {...props}>
                        <TextFilter<ITransaction>
                            displayText="Reference Number"
                            field="reference_number"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { reference_number },
                },
            }) => (
                <span className="font-mono text-sm font-medium">
                    {reference_number}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 160,
        },
        {
            id: 'transaction_reference_number',
            accessorKey: 'transaction_reference_number',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Transaction Ref">
                    <ColumnActions {...props}>
                        <TextFilter<ITransaction>
                            displayText="Transaction Reference Number"
                            field="transaction_reference_number"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { transaction_reference_number },
                },
            }) => (
                <span className="font-mono text-sm">
                    {transaction_reference_number}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 160,
            minSize: 140,
        },
        {
            id: 'source',
            accessorKey: 'source',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Source">
                    <ColumnActions {...props}>
                        <TextFilter<ITransaction>
                            displayText="Source"
                            field="source"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { source },
                },
            }) => (
                <Badge variant="outline" className="text-xs">
                    {source}
                </Badge>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 140,
            minSize: 120,
        },
        {
            id: 'amount',
            accessorKey: 'amount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Amount">
                    <ColumnActions {...props}>
                        <NumberFilter<ITransaction>
                            displayText="Amount"
                            field="amount"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { amount },
                },
            }) => (
                <span className="font-semibold">
                    {amount?.toLocaleString() ?? '-'}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 140,
            minSize: 120,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<ITransaction>
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
            }) => <span className="text-sm">{description || '-'}</span>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 200,
            minSize: 180,
        },
        {
            id: 'transaction_batch_id',
            accessorKey: 'transaction_batch_id',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Batch ID">
                    <ColumnActions {...props}>
                        <TextFilter<ITransaction>
                            displayText="Transaction Batch ID"
                            field="transaction_batch_id"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { transaction_batch_id },
                },
            }) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {transaction_batch_id || '-'}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 160,
            minSize: 140,
        },

        ...createUpdateColumns<ITransaction>(),
    ]

    if (!opts?.hideSelect) {
        columns.unshift({
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
        })
    }

    return columns
}

export default TransactionTableColumns
