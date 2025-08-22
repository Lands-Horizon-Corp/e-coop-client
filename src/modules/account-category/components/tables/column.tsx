import { toReadableDate } from '@/helpers/date-utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'
import { PlainTextEditor } from '@/components/ui/text-editor'

import { IAccountCategory } from '../../account-category.types'
import AccountCategoryAction from './row-action-context'

export const AccountCategoryGlobalSearchTargets: IGlobalSearchTargets<IAccountCategory>[] =
    [
        { field: 'name', displayText: 'Category Name' },
        { field: 'description', displayText: 'Description' },
    ]

export interface IAccountCategoryTableActionComponentProp {
    row: Row<IAccountCategory>
}

export interface IAccountCategoryTableColumnProps {
    actionComponent?: (
        props: IAccountCategoryTableActionComponentProp
    ) => React.ReactNode
}

const AccountCategoryTableColumns = (
    opts?: IAccountCategoryTableColumnProps
): ColumnDef<IAccountCategory>[] => [
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
        id: 'name',
        accessorKey: 'name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Category Name">
                <ColumnActions {...props}>
                    <TextFilter<IAccountCategory>
                        displayText="Category Name"
                        field="name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { name },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                <span className="truncate text-xs text-muted-foreground/70">
                    {name || '-'}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 220,
        minSize: 180,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IAccountCategory>
                        displayText="Description"
                        field="description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { description },
            },
        }) => (
            <div>
                <PlainTextEditor content={description ?? '-'} />
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 180,
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { created_at },
            },
        }) => (
            <span className="text-sm font-semibold">
                {created_at ? toReadableDate(created_at) : '-'}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 150,
    },
    {
        id: 'actions',
        header: () => null,
        cell: ({ row }) => <AccountCategoryAction row={row} />,
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 80,
        minSize: 80,
    },
]

export default AccountCategoryTableColumns
