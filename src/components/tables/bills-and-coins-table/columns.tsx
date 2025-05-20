import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { PushPinSlashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'
import { IBillsAndCoin } from '@/types/coop-types/bills-and-coins'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'

export const billsAndCoinsGlobalSearchTargets: IGlobalSearchTargets<IBillsAndCoin>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'country_code', displayText: 'Country Code' },
    ]

export interface IBillsAndCoinsTableActionComponentProp {
    row: Row<IBillsAndCoin>
}

export interface IBillsAndCoinsTableColumnProps {
    actionComponent?: (
        props: IBillsAndCoinsTableActionComponentProp
    ) => ReactNode
}

const BillsAndCoinsTableColumns = (
    opts?: IBillsAndCoinsTableColumnProps
): ColumnDef<IBillsAndCoin>[] => [
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
        id: 'name',
        accessorKey: 'name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Name">
                <ColumnActions {...props}>
                    <TextFilter<IBillsAndCoin>
                        displayText="Name"
                        field="name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { name, media, country_code },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                <ImageDisplay
                    src={media?.download_url}
                    className="h-9 w-9 rounded-full border bg-muted object-cover"
                />
                <div className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold">
                        {name || '-'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground/70">
                        {country_code || '-'}
                    </span>
                </div>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 200,
        minSize: 180,
    },
    {
        id: 'value',
        accessorKey: 'value',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Value">
                <ColumnActions {...props}>
                    <NumberFilter<IBillsAndCoin>
                        displayText="Value"
                        field="value"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { value },
            },
        }) => (
            <div>
                <span className="text-sm font-semibold">
                    {value?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                    })}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 120,
        minSize: 100,
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props}>
                    <DateFilter<IBillsAndCoin>
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
                <span className="text-sm font-semibold">
                    {created_at ? toReadableDate(created_at) : '-'}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 150,
    },
]

export default BillsAndCoinsTableColumns
