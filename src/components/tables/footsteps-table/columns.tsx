import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import ImageDisplay from '@/components/image-display'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import FootstepTableAdminAction from './row-actions/footstep-table-admin-action'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils/date-utils'
import { IFootstep, IUserBase } from '@/types'

export const footstepGlobalSearchTargets: IGlobalSearchTargets<IFootstep>[] = [
    { field: 'description', displayText: 'Description' },
    { field: 'activity', displayText: 'Activity' },
    { field: 'module', displayText: 'Module' },
    { field: 'user.full_name', displayText: 'Fullname' },
]

export interface IFootstepTableActionComponentProp {
    row: Row<IFootstep>
}

export interface IFootstepTableColumnProps {
    actionComponent?: (props: IFootstepTableActionComponentProp) => ReactNode
}

const footstepTableColumns = (
    opts?: IFootstepTableColumnProps
): ColumnDef<IFootstep>[] => {
    const displayUserMediaAndName = (user?: IUserBase) => {
        if (!user) {
            return <span className="italic text-foreground/40">No data</span>
        }

        return (
            <div className="flex items-center gap-2">
                {user.media?.download_url && (
                    <ImageDisplay
                        src={user.media.download_url}
                        className="size-7 rounded-full"
                    />
                )}
                <div>{user.full_name}</div>
            </div>
        )
    }

    return [
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) =>
                opts?.actionComponent ? (
                    opts.actionComponent({ row })
                ) : (
                    <FootstepTableAdminAction row={row} />
                ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="description"
                            displayText="Description"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { description },
                },
            }) => <div>{description}</div>,
        },
        {
            id: 'activity',
            accessorKey: 'activity',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Activity">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="activity"
                            displayText="Activity"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { activity },
                },
            }) => <div>{activity}</div>,
        },
        {
            id: 'module',
            accessorKey: 'module',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Module">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="module"
                            displayText="Module"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { module },
                },
            }) => <div>{module}</div>,
        },
        {
            id: 'user',
            header: 'User',
            cell: ({
                row: {
                    original: { user },
                },
            }) => displayUserMediaAndName(user),
            enableSorting: false,
        },
        {
            id: 'longitude',
            accessorKey: 'longitude',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Longitude">
                    <ColumnActions {...props}>
                        <NumberFilter
                            displayText="Longitude"
                            field="longitude"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { longitude },
                },
            }) => <div>{longitude}</div>,
        },
        {
            id: 'latitude',
            accessorKey: 'latitude',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Latitude">
                    <ColumnActions {...props}>
                        <NumberFilter displayText="Latitude" field="latitude" />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { latitude },
                },
            }) => <div>{latitude}</div>,
        },
        {
            id: 'user_agent',
            accessorKey: 'user_agent',
            header: (props) => (
                <DataTableColumnHeader {...props} title="User Agent">
                    <ColumnActions {...props}>
                        <TextFilter
                            displayText="User Agent"
                            field="user_agent"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { user_agent },
                },
            }) => <div>{user_agent}</div>,
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
            cell: ({
                row: {
                    original: { created_at },
                },
            }) => <div>{toReadableDate(created_at, 'MMMM d, yyyy')}</div>,
        },
    ]
}

export default footstepTableColumns
