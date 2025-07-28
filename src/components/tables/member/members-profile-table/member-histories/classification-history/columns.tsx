import { ReactNode } from 'react'

import { ColumnDef } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import { createUpdateColumns } from '@/components/tables/common-columns'

import { IMemberClassificationHistory } from '@/types'

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

        ...createUpdateColumns<IMemberClassificationHistory>(),
    ]

export default memberClassificationHistoryColumns
