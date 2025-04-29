import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberCenterHistory } from '@/types'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'

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
        cell: ({ row }) => <div>{row.original.memberCenter?.name}</div>,
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
        cell: ({ row }) => <div>{row.original.memberCenter?.description}</div>,
        enableSorting: true,
        enableResizing: false,
    },
    {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props}>
                    <DateFilter<IMemberCenterHistory>
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

export default memberCenterHistoryColumns
