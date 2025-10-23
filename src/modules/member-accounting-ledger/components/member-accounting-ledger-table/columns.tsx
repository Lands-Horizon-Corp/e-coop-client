import { formatNumber } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { currencyFormat } from '@/modules/currency'
import { CurrencyBadge } from '@/modules/currency/components/currency-badge'
import { IMemberAccountingLedger } from '@/modules/member-account-ledger'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'

// import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
// import { PushPinSlashIcon } from '@/components/'

// import { Checkbox } from '@/components/ui/checkbox'

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
        cell: ({ row }) => (
            <div className="flex w-fit items-center gap-x-1 px-0">
                {opts?.actionComponent?.({ row })}
            </div>
        ),
        size: 50,
        minSize: 50,
        enableMultiSort: false,
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
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
            <p>
                <span className="mr-1">{original.account?.name || '-'}</span>
                {original.account?.currency && (
                    <CurrencyBadge
                        currency={original.account.currency}
                        displayFormat="symbol-code"
                        size="sm"
                    />
                )}
            </p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 400,
        minSize: 200,
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
                {original.balance
                    ? currencyFormat(original.balance, {
                          currency: original.account.currency,
                          showSymbol: !!original.account.currency,
                      })
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
            <p className="text-right">
                {original.hold_out
                    ? currencyFormat(original.hold_out, {
                          currency: original.account.currency,
                          showSymbol: !!original.account.currency,
                      })
                    : '-'}
            </p>
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
                {original.fines
                    ? currencyFormat(original.fines, {
                          currency: original.account.currency,
                          showSymbol: !!original.account.currency,
                      })
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
                {original.due
                    ? currencyFormat(original.due, {
                          currency: original.account.currency,
                          showSymbol: !!original.account.currency,
                      })
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
                    ? currencyFormat(original.carried_forward_due, {
                          currency: original.account.currency,
                          showSymbol: !!original.account.currency,
                      })
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
                    ? currencyFormat(original.stored_value_facility, {
                          currency: original.account.currency,
                          showSymbol: !!original.account.currency,
                      })
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
                    ? currencyFormat(original.principal_due, {
                          currency: original.account.currency,
                          showSymbol: !!original.account.currency,
                      })
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
        cell: ({
            row: {
                original: { last_pay },
            },
        }) => (
            <div>
                <p>{last_pay ? toReadableDate(last_pay) : ''} </p>
                {last_pay ? (
                    <p className="text-xs text-muted-foreground/60">
                        {toReadableDate(last_pay, 'h:mm a -')}{' '}
                        {dateAgo(last_pay)}
                    </p>
                ) : (
                    ''
                )}
            </div>
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
