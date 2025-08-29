import { TPermission } from '@/constants/permission'
import { IUserOrganization } from '@/modules/user-organization'
import { ColumnDef, Row } from '@tanstack/react-table'

import { UserOrganizationApplicationStatusBadge } from '@/components/badges/user-organization-application-status-badge'
import { UserTypeBadge } from '@/components/badges/user-type-badge'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { PermissionViewModal } from '@/modules/permission-template/components/permission/permission-view'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { TGeneralStatus } from '@/types'

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
                <PreviewMediaWrapper media={user?.media}>
                    <ImageDisplay
                        src={user?.media?.download_url}
                        className="h-9 w-9 rounded-full border bg-muted object-cover"
                    />
                </PreviewMediaWrapper>
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
        size: 200,
        minSize: 200,
    },
    {
        id: 'full_name',
        accessorKey: 'user.full_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Full Name">
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
                original: {
                    user: { full_name },
                },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">{full_name}</div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 200,
        minSize: 200,
    },
    {
        id: 'first_name',
        accessorKey: 'user.first_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="First Name">
                <ColumnActions {...props}>
                    <TextFilter<IUserOrganization>
                        displayText="First Name"
                        field="user.first_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: {
                    user: { first_name },
                },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">{first_name}</div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 200,
        minSize: 200,
    },
    {
        id: 'middle_name',
        accessorKey: 'user.middle_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Middle Name">
                <ColumnActions {...props}>
                    <TextFilter<IUserOrganization>
                        displayText="Middle Name"
                        field="user.middle_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: {
                    user: { middle_name },
                },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">{middle_name}</div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 200,
        minSize: 200,
    },
    {
        id: 'last_name',
        accessorKey: 'user.last_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Last Name">
                <ColumnActions {...props}>
                    <TextFilter<IUserOrganization>
                        displayText="Last Name"
                        field="user.last_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: {
                    user: { last_name },
                },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">{last_name}</div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 200,
        minSize: 200,
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
                <UserOrganizationApplicationStatusBadge
                    size="sm"
                    status={application_status}
                />
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 200,
        minSize: 200,
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
        }) => <UserTypeBadge userType={user_type} size="sm" />,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 150,
        minSize: 150,
    },
    {
        id: 'permission',
        accessorKey: 'permission_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Permission">
                <ColumnActions {...props}>
                    <TextFilter<IUserOrganization>
                        displayText="Permission"
                        field="permission_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <PermissionCell
                permissions={original.permissions}
                permission_name={original.permission_name}
                permission_description={original.permission_description}
            />
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        size: 350,
        minSize: 350,
    },
    ...createUpdateColumns<IUserOrganization>(),
]

const PermissionCell = ({
    permission_name,
    permission_description,
    permissions,
}: {
    permission_name: string
    permission_description: string
    permissions: TPermission[]
}) => {
    const viewPermissions = useModalState()

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full min-w-0 justify-between items-center gap-3"
        >
            <div>
                <p className="capitalize">{permission_name}</p>
                <p className="text-xs text-muted-foreground/80">
                    {permission_description}
                </p>
            </div>
            <PermissionViewModal
                permissions={permissions}
                {...viewPermissions}
            />
            <Badge
                onClick={(e) => {
                    e.stopPropagation()
                    viewPermissions.onOpenChange(true)
                }}
                variant="success"
                className="text-xs px-2 py-1 h-fit cursor-pointer opacity-90 hover:opacity-100 duration-200 ease-in-out"
            >
                <p>{permissions.length} permissions</p>
            </Badge>
        </div>
    )
}

export default EmployeesTableColumns
