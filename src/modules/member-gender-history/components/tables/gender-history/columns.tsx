import { ReactNode } from 'react'

import { IMemberGenderHistory } from '@/modules/member-gender-history/member-gender-history.types'
import { ColumnDef } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'

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
        cell: ({ row }) => <div>{row.original.member_gender?.name}</div>,
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
        cell: ({ row }) => <div>{row.original.member_gender?.description}</div>,
        enableSorting: true,
        enableResizing: false,
    },
    ...createUpdateColumns<IMemberGenderHistory>(),
]

export default memberGenderHistoryColumns
