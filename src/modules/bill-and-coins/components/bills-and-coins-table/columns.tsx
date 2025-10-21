import { ReactNode } from 'react'

import { currencyFormat } from '@/modules/currency'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Checkbox } from '@/components/ui/checkbox'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IBillsAndCoin } from '../../bill-and-coins.types'

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
                    <TextFilter<IBillsAndCoin>
                        displayText="Name"
                        field="name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { name, media, currency },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                <PreviewMediaWrapper media={media}>
                    <ImageDisplay
                        className="h-9 w-9 rounded-full border bg-muted object-cover"
                        src={media?.download_url}
                    />
                </PreviewMediaWrapper>
                <div className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold">
                        {name || '-'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground/70">
                        {currency.emoji || '-'}
                        <span className="ml-1.5">
                            {currency.currency_code || '-'}
                        </span>
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
                original: { value, currency },
            },
        }) => (
            <div>
                <span className="text-sm font-semibold">
                    {currencyFormat(value, { currency })}
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

    ...createUpdateColumns<IBillsAndCoin>(),
]

export default BillsAndCoinsTableColumns
