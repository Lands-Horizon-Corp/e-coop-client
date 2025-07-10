import { formatNumber, toReadableDateTime } from '@/utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { createUpdateColumns } from '@/components/tables/common-columns'
import { Checkbox } from '@/components/ui/checkbox'

import { IMemberAccountingLedger } from '@/types'

export const memberGeneralLedgerGlobalSearchTargets: IGlobalSearchTargets<IMemberAccountingLedger>[] =
    [
        { field: 'member_profile_id', displayText: 'Member Profile ID' },
        { field: 'account_id', displayText: 'Account ID' },
    ]

export interface IMemberAccountingLedgerTableActionComponentProp {
    row: Row<IMemberAccountingLedger>
}

export interface IMemberAccountingLedgerTableColumnProps {
    actionComponent?: (
        props: IMemberAccountingLedgerTableActionComponentProp
    ) => React.ReactNode
}

const MemberAccountingLedgerTableColumns = (
    opts?: IMemberAccountingLedgerTableColumnProps
): ColumnDef<IMemberAccountingLedger>[] => [
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
                    onClick={(e) => e.stopPropagation()}
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
        accessorKey: 'account.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Account Title">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Account Title/Name"
                        field="account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <span>{original.account_id || '-'}</span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 400,
        minSize: 400,
    },
    {
        id: 'balance',
        accessorKey: 'balance',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Balance">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Balance"
                        field="balance"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.balance ? formatNumber(original.balance, 2) : '-'}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 200,
        minSize: 200,
    },
    {
        id: 'hold_out',
        accessorKey: 'hold_out',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Hold Out">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Hold Out"
                        field="hold_out"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <span>{original.hold_out ?? '-'}</span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 300,
        minSize: 300,
    },

    {
        id: 'interest',
        accessorKey: 'interest',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Interest">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Interest"
                        field="interest"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.interest
                    ? formatNumber(original.interest, 2) + ' %'
                    : '-'}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 180,
        minSize: 180,
    },
    {
        id: 'fines',
        accessorKey: 'fines',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Fines">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Fines"
                        field="fines"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.fines ? formatNumber(original.fines, 2) : '-'}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 180,
        minSize: 180,
    },
    {
        id: 'due',
        accessorKey: 'due',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Due">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Due"
                        field="due"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.due ? formatNumber(original.due, 2) : '-'}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 180,
        minSize: 180,
    },
    {
        id: 'carried_forward_due',
        accessorKey: 'carried_forward_due',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Carried Forward Due">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Carried Forward Due"
                        field="carried_forward_due"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.carried_forward_due
                    ? formatNumber(original.carried_forward_due, 2)
                    : '-'}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 200,
        minSize: 200,
    },
    {
        id: 'stored_value_facility',
        accessorKey: 'stored_value_facility',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Stored Value Facility">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Stored Value Facility"
                        field="stored_value_facility"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.stored_value_facility
                    ? formatNumber(original.stored_value_facility, 2)
                    : '-'}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 200,
        minSize: 200,
    },
    {
        id: 'principal_due',
        accessorKey: 'principal_due',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Principal Due">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Principal Due"
                        field="principal_due"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <p className="text-right">
                {original.principal_due
                    ? formatNumber(original.principal_due, 2)
                    : '-'}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 200,
        minSize: 200,
    },
    {
        id: 'last_pay',
        accessorKey: 'last_pay',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Last Pay Date">
                <ColumnActions {...props}>
                    <TextFilter<IMemberAccountingLedger>
                        displayText="Last Pay Date"
                        field="last_pay"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <span>
                {original.last_pay ? toReadableDateTime(original.last_pay) : ''}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 200,
        minSize: 200,
    },
    ...createUpdateColumns<IMemberAccountingLedger>(),
]

export default MemberAccountingLedgerTableColumns
