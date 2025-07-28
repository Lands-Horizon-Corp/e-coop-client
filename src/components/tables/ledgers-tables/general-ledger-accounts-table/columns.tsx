import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IGeneralLedger } from '@/types'

export const generalLedgerGlobalSearchTargets: IGlobalSearchTargets<IGeneralLedger>[] =
    [
        { field: 'reference_number', displayText: 'Reference Number' },
        {
            field: 'transaction_reference_number',
            displayText: 'Transaction Ref. Number',
        },
        { field: 'source', displayText: 'Source' },
        { field: 'type', displayText: 'Type' },
        { field: 'account.name', displayText: 'Account Name' },
        { field: 'member_profile.full_name', displayText: 'Member Name' },
        { field: 'employee_user.full_name', displayText: 'Employee Name' },
    ]

export interface IGeneralLedgerTableActionComponentProp {
    row: Row<IGeneralLedger>
}

export interface IGeneralLedgerTableColumnProps {
    actionComponent?: (
        props: IGeneralLedgerTableActionComponentProp
    ) => React.ReactNode
}

const GeneralLedgerTableColumns = (
    opts?: IGeneralLedgerTableColumnProps
): ColumnDef<IGeneralLedger>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className="flex w-fit items-center gap-x-1 px-2">
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
        id: 'reference_number',
        accessorKey: 'reference_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Ref. Number">
                <ColumnActions {...props}>
                    <TextFilter<IGeneralLedger>
                        displayText="Reference Number"
                        field="reference_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div>{original.reference_number || '-'}</div>
        ),
        enableSorting: true,
        enableResizing: true,
        size: 180,
        minSize: 150,
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
        cell: ({ row: { original } }) => <div>{original.source || '-'}</div>,
        enableSorting: true,
        enableResizing: true,
        size: 150,
        minSize: 130,
    },
    {
        id: 'credit',
        accessorKey: 'credit',
        header: (props) => <DataTableColumnHeader {...props} title="Credit" />,
        cell: ({ row: { original } }) => (
            <div className="text-right">
                {original.credit?.toLocaleString() || '0.00'}
            </div>
        ),
        enableSorting: true,
        enableResizing: true,
        size: 120,
        minSize: 100,
    },
    {
        id: 'debit',
        accessorKey: 'debit',
        header: (props) => <DataTableColumnHeader {...props} title="Debit" />,
        cell: ({ row: { original } }) => (
            <div className="text-right">
                {original.debit?.toLocaleString() || '0.00'}
            </div>
        ),
        enableSorting: true,
        enableResizing: true,
        size: 120,
        minSize: 100,
    },
    {
        id: 'balance',
        accessorKey: 'balance',
        header: (props) => <DataTableColumnHeader {...props} title="Balance" />,
        cell: ({ row: { original } }) => (
            <div className="text-right">
                {original.balance?.toLocaleString() || '0.00'}
            </div>
        ),
        enableSorting: true,
        enableResizing: true,
        size: 120,
        minSize: 100,
    },
]

export default GeneralLedgerTableColumns
