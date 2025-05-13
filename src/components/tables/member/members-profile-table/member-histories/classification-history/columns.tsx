import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberClassificationHistory } from '@/types'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'

export interface IMemberClassificationHistoryColumnProps {
    actionComponent?: (props: {
        row: IMemberClassificationHistory
    }) => ReactNode
}

export const memberClassificationHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberClassificationHistory>[] =
    [
        {
            field: 'memberClassification.name',
            displayText: 'Classification Name',
        },
        {
            field: 'memberClassification.description',
            displayText: 'Description',
        },
    ]

const memberClassificationHistoryColumns =
    (): ColumnDef<IMemberClassificationHistory>[] => [
        {
            id: 'memberClassificationName',
            accessorKey: 'memberClassification.name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Classification Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="contains"
                            field="memberClassification.name"
                            displayText="Classification Name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>{row.original.member_classification?.name}</div>
            ),
            enableSorting: true,
            enableResizing: false,
        },
        {
            id: 'memberClassificationDescription',
            accessorKey: 'memberClassification.description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberClassificationHistory>
                            defaultMode="contains"
                            field="memberClassification.description"
                            displayText="Description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>{row.original.member_classification?.description}</div>
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
                        <DateFilter<IMemberClassificationHistory>
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

export default memberClassificationHistoryColumns
