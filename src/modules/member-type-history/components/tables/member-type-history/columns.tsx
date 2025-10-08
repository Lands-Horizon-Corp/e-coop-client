import { ReactNode } from 'react'

import { IMemberTypeHistory } from '@/modules/member-type-history/member-type-history.types'
import { ColumnDef } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'

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
                        displayText="Member Type"
                        field="memberType.name"
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
                        displayText="Description"
                        field="memberType.description"
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
                        displayText="Prefix"
                        field="memberType.prefix"
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
