import { ColumnDef, Row } from '@tanstack/react-table'
import { format } from 'date-fns'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IAdjustmentEntry } from '../../adjustment-entry.types'

export const adjustmentEntryGlobalSearchTargets: IGlobalSearchTargets<IAdjustmentEntry>[] =
    [
        { field: 'account.name', displayText: 'Account Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'reference_number', displayText: 'Reference Number' },
    ]

// --- PROPS INTERFACES ---
export interface IAdjustmentEntryTableActionComponentProp {
    row: Row<IAdjustmentEntry>
}

export interface IAdjustmentEntryTableColumnProps {
    actionComponent?: (
        props: IAdjustmentEntryTableActionComponentProp
    ) => React.ReactNode
}

const AdjustmentEntryTableColumns = (
    opts?: IAdjustmentEntryTableColumnProps
): ColumnDef<IAdjustmentEntry>[] => [
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
        id: 'account_info',
        accessorFn: (row) => row.account.name,
        header: (props) => (
            <DataTableColumnHeader {...props} title="Account & Description">
                <ColumnActions {...props}>
                    <TextFilter<IAdjustmentEntry>
                        displayText="Account Name"
                        field="account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-semibold">
                    {original.account?.name || '-'}
                </span>
                <span className="truncate text-xs text-muted-foreground/70">
                    {original.description || 'No description'}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 280,
        minSize: 200,
    },

    // 3. ENTRY DATE
    {
        id: 'entry_date',
        accessorKey: 'entry_date',
        header: (props) => <DataTableColumnHeader {...props} title="Date" />,
        cell: ({ row }) => {
            const date = new Date(row.original.entry_date)
            return (
                <div className="min-w-[100px]">
                    {format(date, 'MMM dd, yyyy')}
                </div>
            )
        },
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 120,
    },

    // 4. DEBIT
    {
        id: 'debit',
        accessorKey: 'debit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Debit (DR)" />
        ),
        cell: ({ row: { original } }) => (
            <div className="min-w-[100px] text-right font-mono text-primary font-bold">
                {original.debit.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                })}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 140,
        minSize: 120,
    },

    // 5. CREDIT
    {
        id: 'credit',
        accessorKey: 'credit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Credit (CR)" />
        ),
        cell: ({ row: { original } }) => (
            <div className="min-w-[100px] text-right font-mono text-primary font-bold">
                {original.credit.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                })}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 140,
        minSize: 120,
    },

    // 6. REFERENCE NUMBER
    {
        id: 'reference_number',
        accessorKey: 'reference_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Reference No.">
                <ColumnActions {...props}>
                    <TextFilter<IAdjustmentEntry>
                        displayText="Reference Number"
                        field="reference_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="!text-wrap text-muted-foreground">
                {original.reference_number || '-'}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 180,
        minSize: 140,
    },

    // 7. CREATED/UPDATED COLUMNS (Common)
    ...createUpdateColumns<IAdjustmentEntry>(),
]

export default AdjustmentEntryTableColumns
