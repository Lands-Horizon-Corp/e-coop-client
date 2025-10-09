import { ReactNode } from 'react'

import { IMemberOccupationHistory } from '@/modules/member-occupation-history/member-occupation-history.types'
import { ColumnDef } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'

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
                            displayText="Occupation"
                            field="member_occupation.name"
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
                            displayText="Description"
                            field="member_occupation.description"
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
        ...createUpdateColumns<IMemberOccupationHistory>(),
    ]

export default memberOccupationHistoryColumns
