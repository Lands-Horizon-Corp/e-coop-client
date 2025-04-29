import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberClassificationHistoryResource } from '@/types/coop-types'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'

export interface IMemberClassificationHistoryColumnProps {
    actionComponent?: (props: {
        row: IMemberClassificationHistoryResource
    }) => ReactNode
}

export const memberClassificationHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberClassificationHistoryResource>[] =
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
    (): ColumnDef<IMemberClassificationHistoryResource>[] => [
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
                <div>{row.original.memberClassification?.name}</div>
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
                        <TextFilter<IMemberClassificationHistoryResource>
                            defaultMode="contains"
                            field="memberClassification.description"
                            displayText="Description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>{row.original.memberClassification?.description}</div>
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
                        <DateFilter<IMemberClassificationHistoryResource>
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

export default memberClassificationHistoryColumns
