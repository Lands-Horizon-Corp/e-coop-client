import { ReactNode } from 'react'

import { IMemberGroupHistory } from '@/modules/member-group-history/member-group-history.types'
import { ColumnDef } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'

export interface IMemberGroupHistoryColumnProps {
    actionComponent?: (props: { row: IMemberGroupHistory }) => ReactNode
}

export const memberGroupHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberGroupHistory>[] =
    [
        { field: 'member_group.name', displayText: 'Name' },
        { field: 'member_group.description', displayText: 'Description' },
    ]

const memberGroupHistoryColumns = (): ColumnDef<IMemberGroupHistory>[] => [
    {
        id: 'memberProfileId',
        accessorKey: 'member_group.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Member Group">
                <ColumnActions {...props}>
                    <TextFilter
                        defaultMode="contains"
                        displayText="Group Name"
                        field="member_group.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.member_group?.name}</div>,
        enableSorting: true,
        enableResizing: false,
    },
    {
        id: 'memberCenterId',
        accessorKey: 'memberCenterId',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter
                        defaultMode="contains"
                        displayText="Description"
                        field="member_group.description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.member_group?.description}</div>,
        enableSorting: true,
        enableResizing: false,
    },

    ...createUpdateColumns<IMemberGroupHistory>(),
]

export default memberGroupHistoryColumns
