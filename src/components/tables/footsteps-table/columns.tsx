import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import { toReadableDateTime } from '@/utils'
import { IFootstep } from '@/types/coop-types/footstep'

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
        cell: ({ row }) => <span>{row.original.user?.user_name}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 160,
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
        cell: ({ row }) => <span>{row.original.module}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 140,
        minSize: 100,
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
        cell: ({ row }) => <span>{row.original.description}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 200,
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
        cell: ({ row }) => <span>{row.original.ip_address}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 140,
        minSize: 100,
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
        cell: ({ row }) => <span>{row.original.location}</span>,
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
            <span>{toReadableDateTime(row.original.created_at)}</span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 150,
    },
]

export default FootstepTableColumns
