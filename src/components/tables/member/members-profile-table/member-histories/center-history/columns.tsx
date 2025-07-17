import { ReactNode } from 'react'

import { ColumnDef } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import { createUpdateColumns } from '@/components/tables/common-columns'

import { IMemberCenterHistory } from '@/types'

export interface IMemberCenterHistoryColumnProps {
    actionComponent?: (props: { row: IMemberCenterHistory }) => ReactNode
}

export const memberCenterHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberCenterHistory>[] =
    [
        { field: 'memberCenter.name', displayText: 'Name' },
        { field: 'memberCenter.description', displayText: 'Description' },
    ]

const memberCenterHistoryColumns = (): ColumnDef<IMemberCenterHistory>[] => [
    {
        id: 'memberProfileId',
        accessorKey: 'memberCenter.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Member Center">
                <ColumnActions {...props}>
                    <TextFilter
                        defaultMode="contains"
                        field="memberCenter.name"
                        displayText="Member Center"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.member_center?.name}</div>,
        enableSorting: true,
        enableResizing: false,
    },
    {
        id: 'memberCenterId',
        accessorKey: 'memberCenterId',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IMemberCenterHistory>
                        defaultMode="contains"
                        field="memberCenter.description"
                        displayText="Member Center"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.member_center?.description}</div>,
        enableSorting: true,
        enableResizing: false,
    },

    ...createUpdateColumns<IMemberCenterHistory>(),
]

export default memberCenterHistoryColumns
