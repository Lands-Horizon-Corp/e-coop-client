import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import { toReadableDate } from '@/utils'
import { IWithdrawalEntry } from '@/types/coop-types/withdrawal-entry'

export const withdrawalEntryGlobalSearchTargets: IGlobalSearchTargets<IWithdrawalEntry>[] =
    [
        { field: 'reference_number', displayText: 'Reference Number' },
        { field: 'employee_user.username', displayText: 'Employee' },
    ]

export interface IWithdrawalEntryTableActionComponentProp {
    row: Row<IWithdrawalEntry>
}

export interface IWithdrawalEntryTableColumnProps {
    actionComponent?: (
        props: IWithdrawalEntryTableActionComponentProp
    ) => ReactNode
}

const BatchWithdrawalEntryTableColumns = (
    _opts?: IWithdrawalEntryTableColumnProps
): ColumnDef<IWithdrawalEntry>[] => [
    {
        id: 'reference_number',
        accessorKey: 'reference_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Reference #">
                <ColumnActions {...props}>
                    <TextFilter<IWithdrawalEntry>
                        displayText="Reference #"
                        field="reference_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span className="font-semibold">
                {row.original.reference_number}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 160,
        minSize: 120,
    },
    {
        id: 'employee_user',
        accessorKey: 'employee_user.username',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Employee">
                <ColumnActions {...props}>
                    <TextFilter<IWithdrawalEntry>
                        displayText="Employee"
                        field="employee_user.username"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span>
                {row.original.employee_user?.user_name ||
                    row.original.employee_user_id ||
                    '-'}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 140,
        minSize: 100,
    },
    {
        id: 'debit',
        accessorKey: 'debit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Debit">
                <ColumnActions {...props}>
                    <NumberFilter<IWithdrawalEntry>
                        displayText="Debit"
                        field="debit"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span>
                {row.original.debit?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                })}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 120,
        minSize: 100,
    },
    {
        id: 'credit',
        accessorKey: 'credit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Credit">
                <ColumnActions {...props}>
                    <NumberFilter<IWithdrawalEntry>
                        displayText="Credit"
                        field="credit"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span>
                {row.original.credit?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                })}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 120,
        minSize: 100,
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props}>
                    <DateFilter<IWithdrawalEntry>
                        displayText="Date Created"
                        field="created_at"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span>
                {row.original.created_at
                    ? toReadableDate(row.original.created_at)
                    : '-'}
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

export default BatchWithdrawalEntryTableColumns
