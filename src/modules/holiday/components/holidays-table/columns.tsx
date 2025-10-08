import { ReactNode } from 'react'

import { toReadableDate } from '@/helpers/date-utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IHoliday } from '../../holiday.types'

export const holidayGlobalSearchTargets: IGlobalSearchTargets<IHoliday>[] = [
    { field: 'name', displayText: 'Name' },
    { field: 'description', displayText: 'Description' },
]

export interface IHolidayTableActionComponentProp {
    row: Row<IHoliday>
}

export interface IHolidayTableColumnProps {
    actionComponent?: (props: IHolidayTableActionComponentProp) => ReactNode
}

const HolidayTableColumns = (
    opts?: IHolidayTableColumnProps
): ColumnDef<IHoliday>[] => {
    return [
        {
            id: 'select',
            header: ({ table, column }) => (
                <div className={'flex w-fit items-center gap-x-1 px-2'}>
                    <HeaderToggleSelect table={table} />
                    {!column.getIsPinned() && (
                        <PushPinSlashIcon
                            className="mr-2 size-3.5 cursor-pointer"
                            onClick={() => column.pin('left')}
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
            id: 'name',
            accessorKey: 'name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Name">
                    <ColumnActions {...props}>
                        <TextFilter<IHoliday> displayText="Name" field="name" />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { name },
                },
            }) => <div>{name}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<IHoliday>
                            displayText="Description"
                            field="description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { description },
                },
            }) => <div>{description}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            minSize: 300,
            maxSize: 500,
        },
        {
            id: 'entry_date',
            accessorKey: 'entry_date',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Calendar Date">
                    <ColumnActions {...props}>
                        <DateFilter<IHoliday>
                            displayText="Calendar Date"
                            field="entry_date"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { entry_date },
                },
            }) => <div>{toReadableDate(entry_date)}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
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
            }) => <div>{toReadableDate(created_at)}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
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

export default HolidayTableColumns
