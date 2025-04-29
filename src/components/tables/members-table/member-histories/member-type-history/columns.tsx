import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberTypeHistory } from '@/types/coop-types'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'

export interface IMemberTypeHistoryColumnProps {
    actionComponent?: (props: { row: IMemberTypeHistory }) => ReactNode
}

export const memberTypeHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberTypeHistory>[] =
    [
        { field: 'memberType.name', displayText: 'Name' },
        { field: 'memberType.description', displayText: 'Description' },
        { field: 'memberType.prefix', displayText: 'Prefix' },
    ]

const memberTypeHistoryColumns = (): ColumnDef<IMemberTypeHistory>[] => [
    {
        id: 'memberProfileId',
        accessorKey: 'memberType.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Member Type">
                <ColumnActions {...props}>
                    <TextFilter
                        defaultMode="contains"
                        field="memberType.name"
                        displayText="Member Type"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.memberType?.name}</div>,
        enableSorting: true,
        enableResizing: false,
    },
    {
        id: 'description',
        accessorKey: 'memberType.description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IMemberTypeHistory>
                        defaultMode="contains"
                        field="memberType.description"
                        displayText="Description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.memberType?.description}</div>,
        enableSorting: true,
        enableResizing: false,
    },
    {
        id: 'prefix',
        accessorKey: 'memberType.prefix',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Prefix">
                <ColumnActions {...props}>
                    <TextFilter<IMemberTypeHistory>
                        defaultMode="contains"
                        field="memberType.prefix"
                        displayText="Prefix"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.memberType?.prefix}</div>,
        enableSorting: true,
        enableResizing: false,
    },
    {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props}>
                    <DateFilter<IMemberTypeHistory>
                        displayText="Date Created"
                        field="createdAt"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>
                {format(
                    new Date(row.original.createdAt),
                    'MMMM dd, yyyy (EEE) h:mm a'
                )}
            </div>
        ),
        enableSorting: true,
        enableResizing: false,
    },
]

export default memberTypeHistoryColumns
