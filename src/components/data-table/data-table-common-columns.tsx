import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { ColumnDef } from '@tanstack/react-table'

import { ITimeStamps } from '@/types'

import DataTableColumnHeader from './data-table-column-header'
import ColumnActions from './data-table-column-header/column-actions'
import DateFilter from './data-table-filters/date-filter'

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
            }) => (
                <div>
                    <p>{created_at ? toReadableDate(created_at) : ''} </p>
                    {created_at ? (
                        <p className="text-xs text-muted-foreground/60">
                            {toReadableDate(created_at, 'h:mm a -')}{' '}
                            {dateAgo(created_at)}
                        </p>
                    ) : (
                        ''
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            minSize: 200,
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
            }) => (
                <div>
                    <p>{updated_at ? toReadableDate(updated_at) : ''} </p>
                    {updated_at ? (
                        <p className="text-xs text-muted-foreground/60">
                            {toReadableDate(updated_at, 'h:mm a -')}{' '}
                            {dateAgo(updated_at)}
                        </p>
                    ) : (
                        ''
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            minSize: 200,
        },
    ]
}
