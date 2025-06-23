import { ReactNode } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { createUpdateColumns } from '@/components/tables/common-columns'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberTypeHistory } from '@/types'

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
        cell: ({ row }) => <div>{row.original.member_type?.name}</div>,
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
        cell: ({ row }) => <div>{row.original.member_type?.description}</div>,
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
        cell: ({ row }) => <div>{row.original.member_type?.prefix}</div>,
        enableSorting: true,
        enableResizing: false,
    },

    ...createUpdateColumns<IMemberTypeHistory>(),
]

export default memberTypeHistoryColumns
