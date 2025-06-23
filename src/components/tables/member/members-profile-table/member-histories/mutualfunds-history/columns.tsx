import { ReactNode } from 'react'
import { ColumnDef } from '@tanstack/react-table'

import { createUpdateColumns } from '@/components/tables/common-columns'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberMutualFundsHistory } from '@/types'

export interface IMemberMutualFundsHistoryColumnProps {
    actionComponent?: (props: { row: IMemberMutualFundsHistory }) => ReactNode
}

export const memberMutualFundsHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberMutualFundsHistory>[] =
    [
        { field: 'description', displayText: 'Description' },
        { field: 'amount', displayText: 'Amount' },
    ]

const memberMutualFundsHistoryColumns =
    (): ColumnDef<IMemberMutualFundsHistory>[] => [
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberMutualFundsHistory>
                            defaultMode="contains"
                            field="description"
                            displayText="Description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => <div>{row.original.description}</div>,
            enableSorting: true,
            enableResizing: false,
        },
        {
            id: 'amount',
            accessorKey: 'amount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Amount">
                    <ColumnActions {...props}>
                        <NumberFilter<IMemberMutualFundsHistory>
                            field="amount"
                            displayText="Amount"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => <div>{row.original.amount}</div>,
            enableSorting: true,
            enableResizing: false,
        },
        ...createUpdateColumns<IMemberMutualFundsHistory>(),
    ]

export default memberMutualFundsHistoryColumns
