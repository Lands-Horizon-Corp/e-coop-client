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
import { formatNumber, toReadableDate } from '@/utils'
import { ICheckEntry } from '@/types/coop-types/check-entry'
import ImageNameDisplay from '@/components/elements/image-name-display'
import { createUpdateColumns } from '../../common-columns'

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
        id: 'check_number',
        accessorKey: 'check_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Check">
                <ColumnActions {...props}>
                    <TextFilter<ICheckEntry>
                        displayText="Check"
                        field="check_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { check_number },
            },
        }) => <p>{check_number}</p>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 260,
        minSize: 200,
    },
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
        cell: ({
            row: {
                original: { employee_user },
            },
        }) => (
            <span>
                {employee_user && (
                    <ImageNameDisplay
                        name={employee_user?.full_name}
                        src={employee_user?.media?.download_url}
                    />
                )}
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
        id: 'member_profile.full_name',
        accessorKey: 'member_profile.full_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Member Profile">
                <ColumnActions {...props}>
                    <TextFilter<ICheckEntry>
                        displayText="Member Profile"
                        field="member_profile.full_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { member_profile },
            },
        }) => (
            <span>
                <ImageNameDisplay
                    name={member_profile?.full_name}
                    src={member_profile?.media?.download_url}
                />
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 250,
        minSize: 250,
    },
    {
        id: 'member_joint_account.full_name',
        accessorKey: 'member_joint_account.full_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Joint Account">
                <ColumnActions {...props}>
                    <TextFilter<ICheckEntry>
                        displayText="Joint Account"
                        field="member_joint_account.full_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { member_joint_account },
            },
        }) => (
            <span>
                {member_joint_account && (
                    <ImageNameDisplay
                        name={member_joint_account?.full_name}
                        src={member_joint_account?.picture_media.download_url}
                    />
                )}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 250,
        minSize: 250,
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
            <p className="text-right">{formatNumber(row.original.debit, 2)}</p>
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
            <p className="text-right">{formatNumber(row.original.credit, 2)}</p>
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
                    ? toReadableDate(
                          row.original.check_date,
                          "MMM dd yyyy 'at' hh:mm a"
                      )
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

    ...createUpdateColumns<ICheckEntry>(),
]

export default BatchCheckEntryTableColumns
