import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { PushPinSlashIcon } from '@/components/icons'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { createUpdateColumns } from '../common-columns'

import { IOnlineEntry } from '@/types'

export const onlineEntryGlobalSearchTargets: IGlobalSearchTargets<IOnlineEntry>[] =
    [{ field: 'reference_number', displayText: 'Reference Number' }]

export interface IOnlineEntryTableActionComponentProp {
    row: Row<IOnlineEntry>
}

export interface IOnlineEntryTableColumnProps {
    actionComponent?: (props: IOnlineEntryTableActionComponentProp) => ReactNode
}

const OnlineEntryTableColumns = (
    opts?: IOnlineEntryTableColumnProps
): ColumnDef<IOnlineEntry>[] => {
    return [
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
            id: 'reference_number',
            accessorKey: 'reference_number',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Reference Number">
                    <ColumnActions {...props}>
                        <TextFilter<IOnlineEntry>
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
            }) => <div>{reference_number}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            minSize: 100,
            size: 300,
            maxSize: 900,
        },
        {
            id: 'transaction_batch',
            accessorKey: 'transaction_batch_id',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Transaction Batch">
                    <ColumnActions {...props}>
                        <TextFilter<IOnlineEntry>
                            displayText="TransactionBatch"
                            field="transaction_batch_id"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { transaction_batch_id },
                },
            }) => <div>{transaction_batch_id}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            minSize: 100,
            size: 300,
            maxSize: 500,
        },
        {
            id: 'debit',
            accessorKey: 'debit',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Debit">
                    <ColumnActions {...props}>
                        <TextFilter<IOnlineEntry>
                            displayText="Debit"
                            field="debit"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { debit },
                },
            }) => <div>{debit}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            minSize: 120,
            maxSize: 400,
        },
        {
            id: 'credit',
            accessorKey: 'credit',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Credit">
                    <ColumnActions {...props}>
                        <TextFilter<IOnlineEntry>
                            displayText="Credit"
                            field="credit"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { credit },
                },
            }) => <div>{credit}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            minSize: 120,
            maxSize: 400,
        },
        {
            id: 'payment_Date',
            accessorKey: 'payment_Date',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Payment Date">
                    <ColumnActions {...props}>
                        <TextFilter<IOnlineEntry>
                            displayText="Payment Date"
                            field="payment_Date"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { payment_Date },
                },
            }) => <div>{payment_Date}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 150,
            minSize: 150,
        },
        {
            id: 'employee',
            accessorKey: 'employee_user',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Employee">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { employee_user },
                },
            }) => <div>{employee_user?.full_name ?? ''}</div>,
            enableSorting: false,
            enableResizing: true,
            enableHiding: false,
            minSize: 200,
            maxSize: 400,
        },
        // Add more columns as needed, following the above pattern for other fields
        ...createUpdateColumns<IOnlineEntry>(),
    ]
}

export default OnlineEntryTableColumns
