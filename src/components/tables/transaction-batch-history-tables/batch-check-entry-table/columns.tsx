import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

// import { Checkbox } from '@/components/ui/checkbox'
// import { PushPinSlashIcon } from '@/components/icons'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
// import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import { toReadableDate } from '@/utils'
import { ICheckEntry } from '@/types/coop-types/check-entry'

export const checkEntryGlobalSearchTargets: IGlobalSearchTargets<ICheckEntry>[] =
    [
        { field: 'bank.name', displayText: 'Bank' },
        { field: 'employee_user.username', displayText: 'Employee' },
        { field: 'reference_number', displayText: 'Reference Number' },
    ]

export interface ICheckEntryTableActionComponentProp {
    row: Row<ICheckEntry>
}

export interface ICheckEntryTableColumnProps {
    actionComponent?: (props: ICheckEntryTableActionComponentProp) => ReactNode
}

const BatchCheckEntryTableColumns = (
    _opts?: ICheckEntryTableColumnProps
): ColumnDef<ICheckEntry>[] => [
    {
        id: 'bank',
        accessorKey: 'bank.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Bank">
                <ColumnActions {...props}>
                    <TextFilter<ICheckEntry>
                        displayText="Bank"
                        field="bank.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <span>{row.original.bank?.name || '-'}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 140,
        minSize: 100,
    },
    // {
    //     id: 'reference_number',
    //     accessorKey: 'reference_number',
    //     header: (props) => (
    //         <DataTableColumnHeader {...props} title="Reference #">
    //             <ColumnActions {...props}>
    //                 <TextFilter<ICheckEntry>
    //                     displayText="Reference #"
    //                     field="reference_number"
    //                 />
    //             </ColumnActions>
    //         </DataTableColumnHeader>
    //     ),
    //     cell: ({ row }) => (
    //         <span className="font-semibold">{row.original.}</span>
    //     ),
    //     enableMultiSort: true,
    //     enableSorting: true,
    //     enableResizing: true,
    //     enableHiding: false,
    //     size: 160,
    //     minSize: 120,
    // },
    {
        id: 'employee_user',
        accessorKey: 'employee_user.username',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Employee">
                <ColumnActions {...props}>
                    <TextFilter<ICheckEntry>
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
                    <NumberFilter<ICheckEntry>
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
                    <NumberFilter<ICheckEntry>
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
        id: 'check_date',
        accessorKey: 'check_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Check Date">
                <ColumnActions {...props}>
                    <DateFilter<ICheckEntry>
                        displayText="Check Date"
                        field="check_date"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span>
                {row.original.check_date
                    ? toReadableDate(row.original.check_date)
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

export default BatchCheckEntryTableColumns
