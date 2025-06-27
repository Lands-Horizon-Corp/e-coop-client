import { ColumnDef } from '@tanstack/react-table'

import DateFilter from '../data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '../data-table/data-table-column-header'
import ColumnActions from '../data-table/data-table-column-header/column-actions'

import { toReadableDate } from '@/utils'

import { ITimeStamps } from '@/types'

export const createUpdateColumns = <
    T extends ITimeStamps = ITimeStamps,
>(): ColumnDef<T>[] => {
    return [
        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter
                            displayText="Date Created"
                            field="created_at"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { created_at },
                },
            }) => <div>{created_at ? toReadableDate(created_at) : ''}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
        {
            id: 'updated_at',
            accessorKey: 'updated_at',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Updated">
                    <ColumnActions {...props}>
                        <DateFilter
                            displayText="Date Updated"
                            field="updated_at"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { updated_at },
                },
            }) => <div>{updated_at ? toReadableDate(updated_at) : ''}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
    ]
}
