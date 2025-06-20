import { ColumnDef, Row } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import ImageDisplay from '@/components/image-display'
import { PushPinSlashIcon } from '@/components/icons'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'

import { TGeneralStatus, IUserOrganization } from '@/types'

export const employeesGlobalSearchTargets: IGlobalSearchTargets<IUserOrganization>[] =
    [
        { field: 'user.email', displayText: 'Email' },
        { field: 'user.username', displayText: 'Username' },
        { field: 'user.full_name', displayText: 'Full Name' },
    ]

export interface IEmployeesTableActionComponentProp {
    row: Row<IUserOrganization>
}

export interface IEmployeesTableColumnProps {
    actionComponent?: (
        props: IEmployeesTableActionComponentProp
    ) => React.ReactNode
}

const EmployeesTableColumns = (
    opts?: IEmployeesTableColumnProps
): ColumnDef<IUserOrganization>[] => [
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
        id: 'user',
        accessorKey: 'user',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Employee">
                <ColumnActions {...props}>
                    <TextFilter<IUserOrganization>
                        displayText="Full Name"
                        field="user.full_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { user },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                <ImageDisplay
                    src={user?.media?.download_url}
                    className="h-9 w-9 rounded-full border bg-muted object-cover"
                />
                <div className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold">
                        {user?.full_name || '-'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground/70">
                        {user?.email || user?.email || '-'}
                    </span>
                </div>
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
        id: 'user.user_name',
        accessorKey: 'user.user_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Username">
                <ColumnActions {...props}>
                    <TextFilter<IUserOrganization>
                        displayText="Username"
                        field="user.user_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: {
                    user: { user_name },
                },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">{user_name}</div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 100,
        minSize: 100,
    },
    {
        id: 'application_status',
        accessorKey: 'application_status',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Status">
                <ColumnActions {...props}>
                    <DataTableMultiSelectFilter<
                        IUserOrganization,
                        TGeneralStatus
                    >
                        displayText="Contact"
                        field="application_status"
                        dataType="text"
                        mode="contains"
                        multiSelectOptions={[
                            { label: 'Pending', value: 'pending' },
                            { label: 'For Review', value: 'for review' },
                            { label: 'Not Allowed', value: 'not allowed' },
                            { label: 'Verified', value: 'verified' },
                        ]}
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { application_status },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                {application_status}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 100,
        minSize: 100,
    },
    {
        id: 'branch',
        accessorKey: 'branch',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Branch">
                <ColumnActions {...props}>
                    <TextFilter<IUserOrganization>
                        displayText="Branch"
                        field="branch"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { branch },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">{branch.name}</div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 100,
        minSize: 100,
    },
    {
        id: 'type',
        accessorKey: 'user_type',
        header: (props) => (
            <DataTableColumnHeader {...props} title="User Type">
                <ColumnActions {...props}>
                    <TextFilter<IUserOrganization>
                        displayText="User Type"
                        field="user_type"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { user_type },
            },
        }) => <span className="text-sm font-semibold">{user_type || '-'}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 140,
        minSize: 100,
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props}>
                    <DateFilter<IUserOrganization>
                        displayText="Date Created"
                        field="created_at"
                    />
                </ColumnActions>
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
]

export default EmployeesTableColumns
