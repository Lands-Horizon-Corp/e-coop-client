import { ReactNode } from 'react'

import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { ICheckEntry } from '@/types'

import { createUpdateColumns } from '../common-columns'

export const checkEntryGlobalSearchTargets: IGlobalSearchTargets<ICheckEntry>[] =
    [{ field: 'check_number', displayText: 'Check Number' }]

export interface ICheckEntryTableActionComponentProp {
    row: Row<ICheckEntry>
}

export interface ICheckEntryTableColumnProps {
    actionComponent?: (props: ICheckEntryTableActionComponentProp) => ReactNode
}

const CheckEntryTableColumns = (
    opts?: ICheckEntryTableColumnProps
): ColumnDef<ICheckEntry>[] => {
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
            id: 'check_number',
            accessorKey: 'check_number',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Check Number">
                    <ColumnActions {...props}>
                        <TextFilter<ICheckEntry>
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
            }) => <div>{check_number}</div>,
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
                        <TextFilter<ICheckEntry>
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
                        <TextFilter<ICheckEntry>
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
                        <TextFilter<ICheckEntry>
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
            id: 'check_date',
            accessorKey: 'check_date',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Check Date">
                    <ColumnActions {...props}>
                        <TextFilter<ICheckEntry>
                            displayText="Check Date"
                            field="check_date"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { check_date },
                },
            }) => <div>{check_date}</div>,
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
        ...createUpdateColumns<ICheckEntry>(),
    ]
}

export default CheckEntryTableColumns
