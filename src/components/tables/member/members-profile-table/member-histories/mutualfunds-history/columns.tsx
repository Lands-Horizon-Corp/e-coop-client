import { ReactNode } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberMutualFundsHistory } from '@/types'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'

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
        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<IMemberMutualFundsHistory>
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

export default memberMutualFundsHistoryColumns
