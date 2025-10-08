import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
// import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { ILoanLedger } from '../../loan-ledger.types'

export const loanLedgerGlobalSearchTargets: IGlobalSearchTargets<ILoanLedger>[] =
    [
        { field: 'reference_number', displayText: 'Reference Number' },
        { field: 'type', displayText: 'Type' },
    ]

export interface ILoanLedgerTableActionComponentProp {
    row: Row<ILoanLedger>
}

export interface ILoanLedgerTableColumnProps {
    actionComponent?: (
        props: ILoanLedgerTableActionComponentProp
    ) => React.ReactNode
}

const LoanLedgerTableColumns = (
    opts?: ILoanLedgerTableColumnProps
): ColumnDef<ILoanLedger>[] => [
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
        id: 'reference_number',
        accessorKey: 'reference_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Reference #">
                <ColumnActions {...props}>
                    <TextFilter<ILoanLedger>
                        displayText="Reference #"
                        field="reference_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { reference_number },
            },
        }) => (
            <span className="truncate font-semibold">
                {reference_number || '-'}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 140,
        minSize: 120,
    },
    {
        id: 'entry_date',
        accessorKey: 'entry_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Entry Date">
                <ColumnActions {...props}>
                    <TextFilter<ILoanLedger>
                        displayText="Entry Date"
                        field="entry_date"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { entry_date },
            },
        }) => <span className="truncate">{entry_date || '-'}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 120,
        minSize: 100,
    },
    {
        id: 'debit',
        accessorKey: 'debit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Debit">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { debit },
            },
        }) => <span className="font-mono">{debit ?? 0}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 100,
        minSize: 80,
    },
    {
        id: 'credit',
        accessorKey: 'credit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Credit">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { credit },
            },
        }) => <span className="font-mono">{credit ?? 0}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 100,
        minSize: 80,
    },
    {
        id: 'balance',
        accessorKey: 'balance',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Balance">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { balance },
            },
        }) => <span className="font-mono">{balance ?? 0}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 100,
        minSize: 80,
    },
    {
        id: 'type',
        accessorKey: 'type',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Type">
                <ColumnActions {...props}>
                    <TextFilter<ILoanLedger> displayText="Type" field="type" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { type },
            },
        }) => <span className="truncate">{type || '-'}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 100,
        minSize: 80,
    },
    // Add more columns if needed
    // ...createUpdateColumns<ILoanLedger>(), // Not needed for loan ledger
]

export default LoanLedgerTableColumns
