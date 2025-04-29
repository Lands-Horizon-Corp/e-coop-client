import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import ImageDisplay from '@/components/image-display'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import FootstepTableAdminAction from './row-actions/footstep-table-admin-action'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils/date-utils'
import { IFootstepResource, IUserBase } from '@/types/coop-types'

export const footstepGlobalSearchTargets: IGlobalSearchTargets<IFootstepResource>[] =
    [
        { field: 'description', displayText: 'Description' },
        { field: 'activity', displayText: 'Activity' },
        { field: 'module', displayText: 'Module' },
        { field: 'admin.firstName', displayText: 'Admin' },
        { field: 'employee.firstName', displayText: 'Employee' },
        { field: 'owner.firstName', displayText: 'Owner' },
        { field: 'member.firstName', displayText: 'Member' },
    ]

export interface IFootstepTableActionComponentProp {
    row: Row<IFootstepResource>
}

export interface IFootstepTableColumnProps {
    actionComponent?: (props: IFootstepTableActionComponentProp) => ReactNode
}

const footstepTableColumns = (
    opts?: IFootstepTableColumnProps
): ColumnDef<IFootstepResource>[] => {
    const displayUserMediaAndName = (user?: IUserBase) => {
        if (!user) {
            return <span className="italic text-foreground/40">No data</span>
        }

        return (
            <div className="flex items-center gap-2">
                {user.media?.downloadURL && (
                    <ImageDisplay
                        src={user.media.downloadURL}
                        className="size-7 rounded-full"
                    />
                )}
                <div>
                    {user.firstName} {user.lastName}
                </div>
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
            id: 'admin',
            header: 'Admin',
            cell: ({
                row: {
                    original: { admin },
                },
            }) => displayUserMediaAndName(admin),
            enableSorting: false,
        },
        {
            id: 'employee',
            header: 'Employee',
            cell: ({
                row: {
                    original: { employee },
                },
            }) => displayUserMediaAndName(employee),
            enableSorting: false,
        },
        {
            id: 'owner',
            header: 'Owner',
            cell: ({
                row: {
                    original: { owner },
                },
            }) => displayUserMediaAndName(owner),
            enableSorting: false,
        },
        {
            id: 'member',
            header: 'Member',
            cell: ({
                row: {
                    original: { member },
                },
            }) => displayUserMediaAndName(member),
            enableSorting: false,
        },
        {
            id: 'timestamp',
            accessorKey: 'timestamp',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Timestamp">
                    <ColumnActions {...props}>
                        <DateFilter displayText="Timestamp" field="timestamp" />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { timestamp },
                },
            }) => <div>{toReadableDate(timestamp, 'MMMM d, yyyy HH:mm')}</div>,
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<IFootstepResource>
                            displayText="Date Created"
                            field="createdAt"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { createdAt },
                },
            }) => <div>{toReadableDate(createdAt, 'MMMM d, yyyy')}</div>,
        },
    ]
}

export default footstepTableColumns
