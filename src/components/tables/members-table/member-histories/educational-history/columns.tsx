import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberEducationalAttainmentHistoryResource } from '@/server/types'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'

export interface IMemberEducationalAttainmentHistoryColumnProps {
    actionComponent?: (props: {
        row: IMemberEducationalAttainmentHistoryResource
    }) => ReactNode
}

export const memberEducationalAttainmentHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberEducationalAttainmentHistoryResource>[] =
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
    (): ColumnDef<IMemberEducationalAttainmentHistoryResource>[] => [
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
                <div>{row.original.memberEducationalAttainment?.name}</div>
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
                        <TextFilter<IMemberEducationalAttainmentHistoryResource>
                            defaultMode="contains"
                            field="memberEducationalAttainment.description"
                            displayText="Description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>
                    {row.original.memberEducationalAttainment?.description}
                </div>
            ),
            enableSorting: true,
            enableResizing: false,
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<IMemberEducationalAttainmentHistoryResource>
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

export default memberEducationalAttainmentHistoryColumns
