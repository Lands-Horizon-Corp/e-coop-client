import { ReactNode } from 'react'

import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IBrowseExcludeIncludeAccounts } from '../../browse-exclude-include-accounts.types'

export const browseExcludeIncludeAccountGlobalSearchTargets = [
    { field: 'computation_sheet.name', displayText: 'Computation Sheet' },
    { field: 'fines_account.name', displayText: 'Fines Account' },
    { field: 'comaker_account.name', displayText: 'Comaker Account' },
]

export interface IBrowseExcludeIncludeAccountTableActionComponentProp {
    row: Row<IBrowseExcludeIncludeAccounts>
}

export interface IBrowseExcludeIncludeAccountTableColumnProps {
    actionComponent?: (
        props: IBrowseExcludeIncludeAccountTableActionComponentProp
    ) => ReactNode
}

const BrowseExcludeIncludeAccountColumns = (
    opts?: IBrowseExcludeIncludeAccountTableColumnProps
): ColumnDef<IBrowseExcludeIncludeAccounts>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className="flex w-fit items-center gap-x-1 px-2">
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
    },
    {
        accessorKey: 'computation_sheet.name',
        id: 'computation_sheet',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Computation Sheet">
                <ColumnActions {...props}>
                    <TextFilter
                        displayText="Computation Sheet"
                        field="computation_sheet.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => row.original.computation_sheet?.name ?? '-',
        size: 250,
    },
    {
        accessorKey: 'fines_account.name',
        id: 'fines_account',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Fines Account">
                <ColumnActions {...props}>
                    <TextFilter
                        displayText="Fines Account"
                        field="fines_account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => row.original.fines_account?.name ?? '-',
        size: 250,
    },
    {
        accessorKey: 'comaker_account.name',
        id: 'comaker_account',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Comaker Account">
                <ColumnActions {...props}>
                    <TextFilter
                        displayText="Comaker Account"
                        field="comaker_account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => row.original.comaker_account?.name ?? '-',
        size: 250,
    },
    {
        accessorKey: 'interest_account.name',
        id: 'interest_account',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Interest Account">
                <ColumnActions {...props}>
                    <TextFilter
                        displayText="Interest Account"
                        field="interest_account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => row.original.interest_account?.name ?? '-',
        size: 250,
    },
    {
        accessorKey: 'deliquent_account.name',
        id: 'deliquent_account',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Delinquent Account">
                <ColumnActions {...props}>
                    <TextFilter
                        displayText="Delinquent Account"
                        field="deliquent_account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => row.original.deliquent_account?.name ?? '-',
        size: 250,
    },
    {
        accessorKey: 'include_existing_loan_account.name',
        id: 'include_existing_loan_account',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Existing Loan Account">
                <ColumnActions {...props}>
                    <TextFilter
                        displayText="Existing Loan Account"
                        field="include_existing_loan_account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) =>
            row.original.include_existing_loan_account?.name ?? '-',
        size: 250,
    },
    ...createUpdateColumns<IBrowseExcludeIncludeAccounts>(),
]

export default BrowseExcludeIncludeAccountColumns
