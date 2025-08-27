import { TPermission } from '@/constants/permission'
import { toReadableDateShort } from '@/helpers/date-utils'
import { IInvitationCode } from '@/modules/invitation-code'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon, ShieldExclamationIcon } from '@/components/icons'
import { PermissionViewModal } from '@/components/permission/permission-view'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

export const InvitationCodeGlobalSearchTargets: IGlobalSearchTargets<IInvitationCode>[] =
    [
        { field: 'code', displayText: 'Invitation Code' },
        { field: 'description', displayText: 'Description' },
    ]

export interface IInvitationTableActionComponentProp {
    row: Row<IInvitationCode>
}

export interface IInvitationCodeTableColumnProps {
    actionComponent?: (
        props: IInvitationTableActionComponentProp
    ) => React.ReactNode
}

const InvitationCodeTableColumns = (
    opts?: IInvitationCodeTableColumnProps
): ColumnDef<IInvitationCode>[] => [
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
        id: 'code',
        accessorKey: 'Code',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Code">
                <ColumnActions {...props}>
                    <TextFilter<IInvitationCode>
                        displayText="Code"
                        field="code"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { code },
            },
        }) => (
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex min-w-0 items-center gap-3"
            >
                <CopyWrapper>
                    <span className="truncate group-hover:text-foreground ease-in duration-200 text-xs text-muted-foreground/90">
                        {code || '-'}
                    </span>
                </CopyWrapper>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 220,
        minSize: 220,
    },
    {
        id: 'expiry',
        accessorKey: 'expiration_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Expiration Date">
                <ColumnActions {...props}>
                    <DateFilter
                        displayText="Date Created"
                        field="expiration_date"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { expiration_date },
            },
        }) => (
            <div>
                {expiration_date ? toReadableDateShort(expiration_date) : ''}
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
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IInvitationCode>
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
        }) => <div>{description}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 350,
        minSize: 350,
    },
    {
        id: 'permission',
        accessorKey: 'permission_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Permission">
                <ColumnActions {...props}>
                    <TextFilter<IInvitationCode>
                        displayText="Permission"
                        field="permission_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => <PermissionCell {...original} />,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 150,
    },

    {
        id: 'max_uses',
        accessorKey: 'max uses',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Max Uses">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { max_use },
            },
        }) => (
            <span className="text-sm font-semibold">
                {max_use !== undefined ? max_use : '-'}
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
        id: 'current_uses',
        accessorKey: 'curent uses',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Current Uses">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { current_use },
            },
        }) => (
            <span className="text-sm font-semibold">
                {current_use !== undefined ? current_use : '-'}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 150,
    },
    ...createUpdateColumns<IInvitationCode>(),
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
                <p className="capitalize">
                    {permission_name ?? 'No permission name'}
                </p>
                <p className="text-xs text-muted-foreground/80">
                    {permission_description ?? 'No description'}
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
                <ShieldExclamationIcon className="mr-1" />
                <p>{(permissions ?? []).length} permissions</p>
            </Badge>
        </div>
    )
}

export default InvitationCodeTableColumns
