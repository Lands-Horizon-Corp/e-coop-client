import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import { toReadableDateTime } from '@/utils'
import { ITimesheet } from '@/types/coop-types/timesheet'
import ImageDisplay from '@/components/image-display'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

export const timesheetGlobalSearchTargets: IGlobalSearchTargets<ITimesheet>[] =
    [
        { field: 'user.user_name', displayText: 'User' },
        { field: 'time_in', displayText: 'Time In' },
        { field: 'time_out', displayText: 'Time Out' },
    ]

export interface ITimesheetTableActionComponentProp {
    row: Row<ITimesheet>
}

export interface ITimesheetTableColumnProps {
    actionComponent?: (props: ITimesheetTableActionComponentProp) => ReactNode
}

const TimesheetTableColumns = (
    opts?: ITimesheetTableColumnProps
): ColumnDef<ITimesheet>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className={'flex w-fit items-center gap-x-1 px-2'}>
                <HeaderToggleSelect table={table} />
                {!column.getIsPinned() && (
                    <PushPinSlashIcon
                        onClick={() => column.pin('left')}
                        className="mr-2 size-3.5 cursor-pointer"
                    />
                )}
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex w-fit items-center gap-x-1 px-0">
                {opts?.actionComponent?.({ row })}
                <Checkbox
                    aria-label="Select row"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            </div>
        ),
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 80,
        minSize: 80,
    },
    {
        id: 'user.user_name',
        accessorKey: 'user.user_name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="User">
                <ColumnActions {...props}>
                    <TextFilter<ITimesheet>
                        displayText="User"
                        field="user.user_name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <span>{row.original.user?.user_name}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 160,
        minSize: 120,
    },
    {
        id: 'time_in',
        accessorKey: 'time_in',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Time In">
                <ColumnActions {...props}>
                    <DateFilter<ITimesheet>
                        displayText="Time In"
                        field="time_in"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span>{toReadableDateTime(row.original.time_in)}</span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 120,
    },
    {
        id: 'time_out',
        accessorKey: 'time_out',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Time Out">
                <ColumnActions {...props}>
                    <DateFilter<ITimesheet>
                        displayText="Time Out"
                        field="time_out"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) =>
            row.original.time_out ? (
                <span>{toReadableDateTime(row.original.time_out)}</span>
            ) : (
                <span className="italic text-muted-foreground">-</span>
            ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 120,
    },
    {
        id: 'time_in_media',
        accessorKey: 'media_in',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Time In Photo" />
        ),
        cell: ({ row: { original } }) => (
            <ImageDisplay
                src={original.media_in?.download_url}
                className="size-8 rounded-sm"
            />
        ),
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 120,
    },
    {
        id: 'time_out_media',
        accessorKey: 'media_out',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Time Out Photo" />
        ),
        cell: ({ row: { original } }) => (
            <ImageDisplay
                src={original.media_out?.download_url}
                className="size-8 rounded-sm"
            />
        ),
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 120,
    },
]

export default TimesheetTableColumns
