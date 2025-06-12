import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import ImageNameDisplay from '@/components/elements/image-name-display'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import { formatNumber, toReadableDateTime } from '@/utils'
import { IDepositEntry } from '@/types/coop-types/deposit-entry'

export const depositEntryGlobalSearchTargets: IGlobalSearchTargets<IDepositEntry>[] =
    [
        { field: 'reference_number', displayText: 'Reference Number' },
        { field: 'employee_user.username', displayText: 'Employee' },
    ]

export interface IDepositEntryTableActionComponentProp {
    row: Row<IDepositEntry>
}

export interface IDepositEntryTableColumnProps {
    actionComponent?: (
        props: IDepositEntryTableActionComponentProp
    ) => ReactNode
}

const BatchDepositEntryTableColumns = (
    _opts?: IDepositEntryTableColumnProps
): ColumnDef<IDepositEntry>[] => [
    {
        id: 'reference_number',
        accessorKey: 'reference_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Reference #">
                <ColumnActions {...props}>
                    <TextFilter<IDepositEntry>
                        displayText="Reference #"
                        field="reference_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <p>{row.original.reference_number}</p>,
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
                    <TextFilter<IDepositEntry>
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
                    <TextFilter<IDepositEntry>
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
                {member_profile && (
                    <ImageNameDisplay
                        name={member_profile?.full_name}
                        src={member_profile?.media?.download_url}
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
        id: 'member_joint_account.full_name',
        accessorKey: 'member_joint_account.full_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Joint Account">
                <ColumnActions {...props}>
                    <TextFilter<IDepositEntry>
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
                        src={member_joint_account?.picture_media?.download_url}
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
        id: 'amount',
        accessorKey: 'amount',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Amount">
                <ColumnActions {...props}>
                    <NumberFilter<IDepositEntry>
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
        }) => <p className="text-right">{formatNumber(amount, 2)}</p>,
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
            <DataTableColumnHeader {...props} title="Deposit Date">
                <ColumnActions {...props}>
                    <DateFilter<IDepositEntry>
                        displayText="Deposit Date"
                        field="created_at"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span>
                {row.original.created_at
                    ? toReadableDateTime(row.original.created_at)
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

export default BatchDepositEntryTableColumns
