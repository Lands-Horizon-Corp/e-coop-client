import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import ImageNameDisplay from '@/components/elements/image-name-display'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { formatNumber, toReadableDateTime } from '@/utils'

import { IOnlineEntry } from '@/types/coop-types/online-entry'

export const onlineEntryGlobalSearchTargets: IGlobalSearchTargets<IOnlineEntry>[] =
    [
        { field: 'reference_number', displayText: 'Reference Number' },
        { field: 'employee_user.username', displayText: 'Employee' },
        { field: 'bank.name', displayText: 'Bank' },
    ]

export interface IOnlineEntryTableActionComponentProp {
    row: Row<IOnlineEntry>
}

export interface IOnlineEntryTableColumnProps {
    actionComponent?: (props: IOnlineEntryTableActionComponentProp) => ReactNode
}

const BatchOnlineEntryTableColumns = (
    _opts?: IOnlineEntryTableColumnProps
): ColumnDef<IOnlineEntry>[] => [
    {
        id: 'reference_number',
        accessorKey: 'reference_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Reference #">
                <ColumnActions {...props}>
                    <TextFilter<IOnlineEntry>
                        displayText="Reference #"
                        field="reference_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <span>{row.original.reference_number}</span>,
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
                    <TextFilter<IOnlineEntry>
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
                    <TextFilter<IOnlineEntry>
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
                    <TextFilter<IOnlineEntry>
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
        id: 'bank',
        accessorKey: 'bank.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Bank">
                <ColumnActions {...props}>
                    <TextFilter<IOnlineEntry>
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
        id: 'debit',
        accessorKey: 'debit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Debit">
                <ColumnActions {...props}>
                    <NumberFilter<IOnlineEntry>
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
                    <NumberFilter<IOnlineEntry>
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
        id: 'payment_Date',
        accessorKey: 'payment_Date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Payment Date">
                <ColumnActions {...props}>
                    <DateFilter<IOnlineEntry>
                        displayText="Payment Date"
                        field="payment_Date"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span>
                {row.original.payment_Date
                    ? toReadableDateTime(row.original.payment_Date)
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

export default BatchOnlineEntryTableColumns
