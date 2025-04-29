import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberGenderHistoryResource } from '@/types/coop-types'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'

export interface IMemberGenderHistoryColumnProps {
    actionComponent?: (props: {
        row: IMemberGenderHistoryResource
    }) => ReactNode
}

export const memberGenderHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberGenderHistoryResource>[] =
    [
        { field: 'memberGender.name', displayText: 'Gender Name' },
        { field: 'memberGender.description', displayText: 'Description' },
    ]

const memberGenderHistoryColumns =
    (): ColumnDef<IMemberGenderHistoryResource>[] => [
        {
            id: 'memberProfileId',
            accessorKey: 'memberGender.name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Gender">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="contains"
                            field="memberGender.name"
                            displayText="Gender"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => <div>{row.original.memberGender?.name}</div>,
            enableSorting: true,
            enableResizing: false,
        },
        {
            id: 'description',
            accessorKey: 'memberGender.description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberGenderHistoryResource>
                            defaultMode="contains"
                            field="memberGender.description"
                            displayText="Description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>{row.original.memberGender?.description}</div>
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
                        <DateFilter<IMemberGenderHistoryResource>
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

export default memberGenderHistoryColumns
