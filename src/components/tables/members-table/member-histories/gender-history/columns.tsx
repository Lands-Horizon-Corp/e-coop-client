import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberGenderHistory } from '@/types'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'

export interface IMemberGenderHistoryColumnProps {
    actionComponent?: (props: { row: IMemberGenderHistory }) => ReactNode
}

export const memberGenderHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberGenderHistory>[] =
    [
        { field: 'memberGender.name', displayText: 'Gender Name' },
        { field: 'memberGender.description', displayText: 'Description' },
    ]

const memberGenderHistoryColumns = (): ColumnDef<IMemberGenderHistory>[] => [
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
                    <TextFilter<IMemberGenderHistory>
                        defaultMode="contains"
                        field="memberGender.description"
                        displayText="Description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.memberGender?.description}</div>,
        enableSorting: true,
        enableResizing: false,
    },
    {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props}>
                    <DateFilter<IMemberGenderHistory>
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
