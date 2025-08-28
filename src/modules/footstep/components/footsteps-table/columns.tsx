import { ReactNode } from 'react'

import { toReadableDateTime } from '@/helpers/date-utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import { UserTypeBadge } from '@/components/badges/user-type-badge'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import { DesktopTowerIcon, EyeIcon, LocationPinIcon } from '@/components/icons'
import ImageNameDisplay from '@/components/image-name-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'

import { useModalState } from '@/hooks/use-modal-state'

import { TUserType } from '@/types'

import { IFootstep } from '../../footstep.types'
import FootstepDetail from '../footstep-detail'

export const footstepGlobalSearchTargets: IGlobalSearchTargets<IFootstep>[] = [
    { field: 'user.username', displayText: 'User' },
    { field: 'module', displayText: 'Module' },
    { field: 'activity', displayText: 'Activity' },
    { field: 'description', displayText: 'Description' },
    { field: 'ip_address', displayText: 'IP Address' },
    { field: 'location', displayText: 'Location' },
]

export interface IFootstepTableActionComponentProp {
    row: Row<IFootstep>
}

export interface IFootstepTableColumnProps {
    actionComponent?: (props: IFootstepTableActionComponentProp) => ReactNode
}

const FootstepTableColumns = (
    _opts?: IFootstepTableColumnProps
): ColumnDef<IFootstep>[] => [
    {
        id: 'quick-action',
        header: () => (
            <div className={'flex w-fit items-center gap-x-1 px-2'}></div>
        ),
        cell: ({ row }) => (
            <div className="flex w-fit items-center gap-x-1 px-0">
                <ViewFootstepDetailCell footstep={row.original} />
            </div>
        ),
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 50,
        minSize: 50,
    },
    {
        id: 'user.username',
        accessorKey: 'user.username',
        header: (props) => (
            <DataTableColumnHeader {...props} title="User">
                <ColumnActions {...props}>
                    <TextFilter<IFootstep>
                        displayText="User"
                        field="user.username"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { user },
            },
        }) => (
            <div>
                <ImageNameDisplay
                    name={user?.full_name}
                    src={user?.media?.download_url}
                />
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 160,
        minSize: 120,
    },
    {
        id: 'user_type',
        accessorKey: 'user_type',
        header: (props) => (
            <DataTableColumnHeader {...props} title="User Type">
                <ColumnActions {...props}>
                    <DataTableMultiSelectFilter<TUserType, TUserType>
                        displayText="User Type"
                        field="user_type"
                        dataType="text"
                        mode="equal"
                        multiSelectOptions={[
                            { label: 'Ban', value: 'ban' },
                            { label: 'Employee', value: 'employee' },
                            { label: 'Member', value: 'member' },
                            { label: 'Owner', value: 'owner' },
                        ]}
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>
                <UserTypeBadge
                    size="sm"
                    showIcon
                    userType={row.original.user_type}
                />
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 120,
    },
    {
        id: 'activity',
        accessorKey: 'activity',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Activity">
                <ColumnActions {...props}>
                    <TextFilter<IFootstep>
                        displayText="Activity"
                        field="activity"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <span>{row.original.activity}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 120,
    },
    {
        id: 'module',
        accessorKey: 'module',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Module">
                <ColumnActions {...props}>
                    <TextFilter<IFootstep>
                        displayText="Module"
                        field="module"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>
                <Badge variant="secondary" className="max-w-full">
                    <p>{row.original.module}</p>
                </Badge>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 140,
        minSize: 100,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IFootstep>
                        displayText="Description"
                        field="description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>
                <p className="break-words !text-xs text-foreground/80 !text-wrap">
                    {row.original.description}
                </p>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 400,
        minSize: 120,
    },
    {
        id: 'ip_address',
        accessorKey: 'ip_address',
        header: (props) => (
            <DataTableColumnHeader {...props} title="IP Address">
                <ColumnActions {...props}>
                    <TextFilter<IFootstep>
                        displayText="IP Address"
                        field="ip_address"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { ip_address },
            },
        }) => (
            <div>
                {ip_address && (
                    <>
                        <DesktopTowerIcon className="text-muted-foreground/70 inline mr-2 size-5" />
                        {ip_address}
                    </>
                )}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 160,
    },
    {
        id: 'location',
        accessorKey: 'location',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Location">
                <ColumnActions {...props}>
                    <TextFilter<IFootstep>
                        displayText="Location"
                        field="location"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>
                {row.original.location ? (
                    <>
                        <p>
                            <LocationPinIcon className="inline mr-1 text-rose-400 dark:text-rose-600 size-5" />
                            {row.original.location}
                        </p>
                    </>
                ) : (
                    ''
                )}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 120,
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props}>
                    <DateFilter<IFootstep>
                        displayText="Date Created"
                        field="created_at"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>
                <span>{toReadableDateTime(row.original.created_at)}</span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 180,
    },
]

const ViewFootstepDetailCell = ({ footstep }: { footstep: IFootstep }) => {
    const footstepModal = useModalState()

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Sheet {...footstepModal}>
                <SheetHeader>
                    <SheetTitle className="hidden" />
                    <SheetDescription className="hidden" />
                </SheetHeader>
                <SheetContent
                    side="right"
                    className="!max-w-lg bg-transparent p-2 focus:outline-none border-none"
                >
                    <div className="rounded-xl bg-popover p-6 ecoop-scroll relative h-full overflow-y-auto">
                        <FootstepDetail footstep={footstep} />
                    </div>
                </SheetContent>
            </Sheet>
            <Button
                size="icon"
                variant="ghost"
                className="size-fit p-2 text-muted-foreground"
                onClick={() => footstepModal.onOpenChange(true)}
            >
                <EyeIcon strokeWidth={1.5} />
            </Button>
        </div>
    )
}

export default FootstepTableColumns
