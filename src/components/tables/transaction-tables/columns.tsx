import { IMemberAccountingLedger } from '@/types/coop-types/member/member-accounting-ledger'
import { toReadableDate } from '@/utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'

export const memberAccountingLedgerGlobalSearchTargets: IGlobalSearchTargets<IMemberAccountingLedger>[] =
    [
        { field: 'id', displayText: 'ID' },
        { field: 'member_profile_id', displayText: 'Member Profile ID' },
        { field: 'account_id', displayText: 'Account ID' },
        { field: 'balance', displayText: 'Balance' },
        { field: 'interest', displayText: 'Interest' },
        { field: 'fines', displayText: 'Fines' },
        { field: 'due', displayText: 'Due' },
        { field: 'principal_due', displayText: 'Principal Due' },
    ]

export interface IMemberAccountingLedgerTableActionComponentProp {
    row: Row<IMemberAccountingLedger>
}

export interface IMemberAccountingLedgerTableColumnProps {
    actionComponent?: (
        props: IMemberAccountingLedgerTableActionComponentProp
    ) => void
}

const MemberAccountingLedgerColumns =
    (): ColumnDef<IMemberAccountingLedger>[] => {
        return [
            {
                id: 'id',
                accessorKey: 'id',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="ID">
                        <ColumnActions {...props}>
                            <TextFilter displayText="ID" field="id" />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => <div>{original.id}</div>,
                size: 160,
                maxSize: 250,
                minSize: 160,
                enableHiding: false,
                enablePinning: false,
                enableSorting: false, // IDs are usually not sorted by default
                enableMultiSort: true,
                enableResizing: false,
            },
            {
                id: 'member_profile_id',
                accessorKey: 'member_profile_id',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Member Profile ID">
                        <ColumnActions {...props}>
                            <TextFilter
                                displayText="Member Profile ID"
                                field="member_profile_id"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.member_profile_id}</div>
                ),
                enableMultiSort: true,
                maxSize: 250,
                minSize: 160,
            },
            {
                id: 'account_id',
                accessorKey: 'account_id',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Account ID">
                        <ColumnActions {...props}>
                            <TextFilter
                                displayText="Account ID"
                                field="account_id"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.account_id}</div>
                ),
                enableMultiSort: true,
                maxSize: 250,
                minSize: 160,
            },
            {
                id: 'count',
                accessorKey: 'count',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Count">
                        <ColumnActions {...props}>
                            <TextFilter displayText="Count" field="count" />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => <div>{original.count}</div>,
                enableMultiSort: true,
                minSize: 100,
                maxSize: 150,
            },
            {
                id: 'balance',
                accessorKey: 'balance',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Balance">
                        <ColumnActions {...props}>
                            <TextFilter displayText="Balance" field="balance" />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.balance.toFixed(2)}</div>
                ),
                enableMultiSort: true,
                size: 120,
                maxSize: 200,
                minSize: 100,
            },
            {
                id: 'interest',
                accessorKey: 'interest',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Interest">
                        <ColumnActions {...props}>
                            <TextFilter
                                displayText="Interest"
                                field="interest"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.interest.toFixed(2)}</div>
                ),
                enableMultiSort: true,
                size: 120,
                maxSize: 200,
                minSize: 100,
            },
            {
                id: 'fines',
                accessorKey: 'fines',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Fines">
                        <ColumnActions {...props}>
                            <TextFilter displayText="Fines" field="fines" />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.fines.toFixed(2)}</div>
                ),
                enableMultiSort: true,
                size: 120,
                maxSize: 200,
                minSize: 100,
            },
            {
                id: 'due',
                accessorKey: 'due',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Due">
                        <ColumnActions {...props}>
                            <TextFilter displayText="Due" field="due" />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.due.toFixed(2)}</div>
                ),
                enableMultiSort: true,
                size: 120,
                maxSize: 200,
                minSize: 100,
            },
            {
                id: 'carried_forward_due',
                accessorKey: 'carried_forward_due',
                header: (props) => (
                    <DataTableColumnHeader
                        {...props}
                        title="Carried Forward Due"
                    >
                        <ColumnActions {...props}>
                            <TextFilter
                                displayText="Carried Forward Due"
                                field="carried_forward_due"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.carried_forward_due.toFixed(2)}</div>
                ),
                enableMultiSort: true,
                size: 150,
            },
            {
                id: 'stored_value_facility',
                accessorKey: 'stored_value_facility',
                header: (props) => (
                    <DataTableColumnHeader
                        {...props}
                        title="Stored Value Facility"
                    >
                        <ColumnActions {...props}>
                            <TextFilter
                                displayText="Stored Value Facility"
                                field="stored_value_facility"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.stored_value_facility.toFixed(2)}</div>
                ),
                enableMultiSort: true,
                size: 150,
            },
            {
                id: 'principal_due',
                accessorKey: 'principal_due',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Principal Due">
                        <ColumnActions {...props}>
                            <TextFilter
                                displayText="Principal Due"
                                field="principal_due"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{original.principal_due.toFixed(2)}</div>
                ),
                enableMultiSort: true,
                size: 150,
            },
            {
                id: 'last_pay',
                accessorKey: 'last_pay',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Last Pay">
                        <ColumnActions {...props}>
                            <DateFilter
                                displayText="Last Pay"
                                field="last_pay"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>
                        {original.last_pay
                            ? toReadableDate(original.last_pay)
                            : '-'}
                    </div>
                ),
                enableMultiSort: true,
                minSize: 150,
                maxSize: 200,
            },
            {
                id: 'created_at',
                accessorKey: 'created_at',
                header: (props) => (
                    <DataTableColumnHeader {...props} title="Created At">
                        <ColumnActions {...props}>
                            <DateFilter
                                displayText="Created At"
                                field="created_at"
                            />
                        </ColumnActions>
                    </DataTableColumnHeader>
                ),
                cell: ({ row: { original } }) => (
                    <div>{toReadableDate(original.created_at)}</div>
                ),
                enableMultiSort: true,
                minSize: 150,
                maxSize: 200,
            },
        ]
    }

export default MemberAccountingLedgerColumns
