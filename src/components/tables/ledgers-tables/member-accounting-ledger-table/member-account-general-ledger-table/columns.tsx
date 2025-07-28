import { formatNumber } from '@/utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import { LedgerSourceBadge } from '@/components/badges/ledger-source-badge'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import CopyWrapper from '@/components/elements/copy-wrapper'
import ImageNameDisplay from '@/components/elements/image-name-display'
import { PushPinSlashIcon } from '@/components/icons'
import { createUpdateColumns } from '@/components/tables/common-columns'
import { Checkbox } from '@/components/ui/checkbox'

import { IGeneralLedger } from '@/types'

export const generalLedgerGlobalSearchTargets: IGlobalSearchTargets<IGeneralLedger>[] =
    [
        { field: 'member_profile_id', displayText: 'Member Profile ID' },
        { field: 'account_id', displayText: 'Account ID' },
        { field: 'transaction_reference_number', displayText: 'Reference No.' },
    ]

export interface IMemberAccountGeneralLedgerTableActionComponentProp {
    row: Row<IGeneralLedger>
}

export interface IMemberAccountGeneralLedgerTableColumnProps {
    actionComponent?: (
        props: IMemberAccountGeneralLedgerTableActionComponentProp
    ) => React.ReactNode
}

const MemberAccountGeneralLedgerTableColumns = (
    opts?: IMemberAccountGeneralLedgerTableColumnProps
): ColumnDef<IGeneralLedger>[] => [
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
        id: 'account',
        accessorKey: 'account',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Account">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
                        displayText="Account"
                        field="account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <span>{original.account?.name || '...'}</span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 140,
    },
    {
        id: 'transaction_reference_number',
        accessorKey: 'transaction_reference_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Reference No.">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
                        displayText="Reference No."
                        field="transaction_reference_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <CopyWrapper>
                <span>{original.transaction_reference_number || '-'}</span>
            </CopyWrapper>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 250,
        minSize: 250,
    },

    {
        id: 'credit',
        accessorKey: 'credit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Credit">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
                        displayText="Credit"
                        field="credit"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.credit ? formatNumber(original.credit, 2) : ''}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 120,
        minSize: 100,
    },
    {
        id: 'debit',
        accessorKey: 'debit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Debit">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
                        displayText="Debit"
                        field="debit"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.debit ? formatNumber(original.debit, 2) : ''}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 120,
        minSize: 100,
    },
    {
        id: 'balance',
        accessorKey: 'balance',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Balance">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
                        displayText="Balance"
                        field="balance"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.balance ? formatNumber(original.balance, 2) : ''}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 120,
        minSize: 100,
    },

    {
        id: 'type',
        accessorKey: 'type',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Type">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
                        displayText="Type"
                        field="type"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { type },
            },
        }) => <span>{type ?? '-'}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 120,
        minSize: 100,
    },

    {
        id: 'member_profile',
        accessorKey: 'member_profile.full_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Member">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
                        displayText="Member"
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
                    src={member_profile?.media?.download_url}
                    name={member_profile?.full_name}
                />
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 160,
        minSize: 120,
    },

    {
        id: 'employee',
        accessorKey: 'employee_user',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Employee/Teller">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
                        displayText="Employee/Teller"
                        field="employee_user.full_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { employee_user },
            },
        }) => (
            <span className="relative">
                {employee_user !== undefined && (
                    <ImageNameDisplay
                        src={employee_user?.media?.download_url}
                        name={employee_user?.full_name}
                    />
                )}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 160,
        minSize: 120,
    },

    {
        id: 'source',
        accessorKey: 'source',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Source">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
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
            <span>
                {source && (
                    <LedgerSourceBadge
                        size={'sm'}
                        variant={source}
                        source={source}
                    />
                )}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 160,
        minSize: 120,
    },

    ...createUpdateColumns<IGeneralLedger>(),
]

export default MemberAccountGeneralLedgerTableColumns
