import { ReactNode } from 'react'

import { ColumnDef, Row } from '@tanstack/react-table'
import { CircleFlag } from 'react-circle-flags'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import ImageNameDisplay from '@/components/image-name-display'
import { Checkbox } from '@/components/ui/checkbox'

import { ICashCount } from '../../cash-count.types'

export const cashCountGlobalSearchTargets: IGlobalSearchTargets<ICashCount>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'country_code', displayText: 'Country Code' },
        { field: 'employee_user.first_name', displayText: 'Employee Name' },
        { field: 'transaction_batch_id', displayText: 'Transaction Batch ID' },
    ]

export interface ICashCountTableActionComponentProp {
    row: Row<ICashCount>
}

export interface ICashCountTableColumnProps {
    actionComponent?: (props: ICashCountTableActionComponentProp) => ReactNode
}

const CashCountTableColumns = (
    opts?: ICashCountTableColumnProps
): ColumnDef<ICashCount>[] => {
    return [
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
            id: 'name',
            accessorKey: 'name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Name">
                    <ColumnActions {...props}>
                        <TextFilter<ICashCount>
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
            }) => <div>{name}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
        {
            id: 'country_code',
            accessorKey: 'country_code',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Country">
                    <ColumnActions {...props}>
                        <TextFilter<ICashCount>
                            displayText="Country Code"
                            field="country_code"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { country_code },
                },
            }) => (
                <div className="flex items-center gap-2">
                    <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                        <CircleFlag
                            countryCode={country_code?.toLowerCase()}
                            height={20}
                        />
                    </div>
                    <span className="font-mono">{country_code}</span>
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 140,
            minSize: 140,
        },
        {
            id: 'bill_amount',
            accessorKey: 'bill_amount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Bill Amount">
                    <ColumnActions {...props}>
                        <NumberFilter<ICashCount>
                            displayText="Bill Amount"
                            field="bill_amount"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { bill_amount },
                },
            }) => (
                <div className="text-right font-mono">
                    {bill_amount.toLocaleString()}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 140,
            minSize: 140,
        },
        {
            id: 'quantity',
            accessorKey: 'quantity',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Quantity">
                    <ColumnActions {...props}>
                        <NumberFilter<ICashCount>
                            displayText="Quantity"
                            field="quantity"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { quantity },
                },
            }) => (
                <div className="text-right font-mono">
                    {quantity.toLocaleString()}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 120,
            minSize: 120,
        },
        {
            id: 'amount',
            accessorKey: 'amount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Amount">
                    <ColumnActions {...props}>
                        <NumberFilter<ICashCount>
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
                <div className="text-right font-mono font-semibold">
                    {amount.toLocaleString()}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 140,
            minSize: 140,
        },
        {
            id: 'employee_user',
            accessorFn: (row) => row.employee_user?.first_name || '-',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Employee">
                    <ColumnActions {...props}>
                        <TextFilter<ICashCount>
                            displayText="Employee Name"
                            field="employee_user.first_name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { employee_user },
                },
            }) => (
                <div>
                    <ImageNameDisplay
                        name={
                            employee_user?.full_name ?? employee_user?.user_name
                        }
                        src={employee_user?.media?.download_url}
                    />
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
        {
            id: 'transaction_batch_id',
            accessorKey: 'transaction_batch_id',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Transaction Batch ID">
                    <ColumnActions {...props}>
                        <TextFilter<ICashCount>
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
                <div className="font-mono text-xs">
                    {transaction_batch_id || '-'}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 160,
            minSize: 160,
        },
        ...createUpdateColumns<ICashCount>(),
    ]
}

export default CashCountTableColumns
