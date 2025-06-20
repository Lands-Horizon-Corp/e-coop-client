import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberOccupationHistory } from '@/types'

export interface IMemberOccupationHistoryColumnProps {
    actionComponent?: (props: { row: IMemberOccupationHistory }) => ReactNode
}

export const memberOccupationHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberOccupationHistory>[] =
    [
        { field: 'member_group.name', displayText: 'Name' },
        { field: 'member_group.description', displayText: 'Description' },
    ]

const memberOccupationHistoryColumns =
    (): ColumnDef<IMemberOccupationHistory>[] => [
        {
            id: 'memberProfileId',
            accessorKey: 'memberCenter.name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member Center">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="contains"
                            field="member_occupation.name"
                            displayText="Occupation"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>{row.original.member_occupation?.name}</div>
            ),
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
                            field="member_occupation.description"
                            displayText="Description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>{row.original.member_occupation?.description}</div>
            ),
            enableSorting: true,
            enableResizing: false,
        },
        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter
                            displayText="Date Created"
                            field="created_at"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>
                    {format(
                        new Date(row.original.created_at),
                        'MMMM dd, yyyy (EEE) h:mm a'
                    )}
                </div>
            ),
            enableSorting: true,
            enableResizing: false,
        },
    ]

export default memberOccupationHistoryColumns
