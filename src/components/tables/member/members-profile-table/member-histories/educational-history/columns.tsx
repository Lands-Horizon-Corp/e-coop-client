import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberEducationalAttainmentHistory } from '@/types'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'

export interface IMemberEducationalAttainmentHistoryColumnProps {
    actionComponent?: (props: {
        row: IMemberEducationalAttainmentHistory
    }) => ReactNode
}

export const memberEducationalAttainmentHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberEducationalAttainmentHistory>[] =
    [
        {
            field: 'memberEducationalAttainment.name',
            displayText: 'Educational Attainment',
        },
        {
            field: 'memberEducationalAttainment.description',
            displayText: 'Description',
        },
    ]

const memberEducationalAttainmentHistoryColumns =
    (): ColumnDef<IMemberEducationalAttainmentHistory>[] => [
        {
            id: 'memberProfileId',
            accessorKey: 'memberEducationalAttainment.name',
            header: (props) => (
                <DataTableColumnHeader
                    {...props}
                    title="Educational Attainment"
                >
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="contains"
                            field="memberEducationalAttainment.name"
                            displayText="Educational Attainment"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>{row.original.member_educational_attainment?.name}</div>
            ),
            enableSorting: true,
            enableResizing: false,
        },
        {
            id: 'memberEducationalAttainmentId',
            accessorKey: 'memberEducationalAttainmentId',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberEducationalAttainmentHistory>
                            defaultMode="contains"
                            field="memberEducationalAttainment.description"
                            displayText="Description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>
                    {row.original.member_educational_attainment?.description}
                </div>
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
                        <DateFilter<IMemberEducationalAttainmentHistory>
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

export default memberEducationalAttainmentHistoryColumns
