import { ReactNode } from 'react'

import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { currencyFormat } from '@/modules/currency'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/data-table-multi-select-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { BadgeCheckFillIcon, PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { MUTUAL_FUND_COMPUTATION_TYPES } from '../../mutual-fund.constant'
import {
    IMutualFund,
    TMutualFundComputationType,
} from '../../mutual-fund.types'
import { MUTUAL_FUND_COMPUTATION_TYPE_LABELS } from '../../mutual-fund.utils'

export const mutualFundGlobalSearchTargets: IGlobalSearchTargets<IMutualFund>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'member_profile.full_name', displayText: 'Member Name' },
        { field: 'description', displayText: 'Description' },
    ]

export interface IMutualFundTableActionComponentProp {
    row: Row<IMutualFund>
}

export interface IMutualFundTableColumnProps {
    actionComponent?: (props: IMutualFundTableActionComponentProp) => ReactNode
}

const MutualFundTableColumns = (
    opts?: IMutualFundTableColumnProps
): ColumnDef<IMutualFund>[] => [
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
                    <TextFilter<IMutualFund>
                        defaultMode="contains"
                        displayText="Name"
                        field="name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { name, member_profile },
            },
        }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-semibold">{name || '-'}</span>
                {member_profile && (
                    <span className="truncate text-xs text-muted-foreground/70">
                        {member_profile.full_name || '-'}
                    </span>
                )}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 220,
        minSize: 180,
    },
    {
        id: 'date_of_death',
        accessorKey: 'date_of_death',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date of Death">
                <ColumnActions {...props}>
                    <DateFilter<IMutualFund>
                        displayText="Date of Death"
                        field="date_of_death"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { date_of_death },
            },
        }) => (
            <div className="flex items-start gap-2">
                <div>
                    <p>{date_of_death ? toReadableDate(date_of_death) : '-'}</p>
                    {date_of_death ? (
                        <p className="text-xs text-muted-foreground/60">
                            {toReadableDate(date_of_death, 'h:mm a -')}{' '}
                            {dateAgo(date_of_death)}
                        </p>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 160,
        minSize: 140,
    },
    {
        id: 'amount',
        accessorKey: 'amount',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Amount">
                <ColumnActions {...props}>
                    <NumberFilter<IMutualFund>
                        displayText="Amount"
                        field="amount"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { amount },
            },
        }) => (
            <div>
                <span className="text-sm font-semibold">
                    {currencyFormat(amount)}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 140,
        minSize: 120,
    },
    {
        id: 'computation_type',
        accessorKey: 'computation_type',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Computation Type">
                <ColumnActions {...props}>
                    <DataTableMultiSelectFilter<
                        IMutualFund,
                        TMutualFundComputationType
                    >
                        dataType="text"
                        defaultMode="equal"
                        displayText="Computation Type"
                        field="computation_type"
                        mode="contains"
                        multiSelectOptions={MUTUAL_FUND_COMPUTATION_TYPES.map(
                            (type) => ({
                                label: MUTUAL_FUND_COMPUTATION_TYPE_LABELS[
                                    type
                                ],
                                value: type,
                            })
                        )}
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { computation_type },
            },
        }) => (
            <div>
                <span className="text-sm">
                    {MUTUAL_FUND_COMPUTATION_TYPE_LABELS[computation_type] ||
                        '-'}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 180,
        minSize: 150,
    },
    {
        id: 'extension_only',
        accessorKey: 'extension_only',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Extension Only">
                <ColumnActions {...props}>
                    <DataTableMultiSelectFilter<IMutualFund, boolean>
                        dataType="boolean"
                        defaultMode="equal"
                        displayText="Extension Only"
                        field="extension_only"
                        mode="equal"
                        multiSelectOptions={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { extension_only },
            },
        }) => (
            <div>
                <span className="text-sm">{extension_only ? 'Yes' : 'No'}</span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 140,
        minSize: 120,
    },
    {
        id: 'posted_date',
        accessorKey: 'posted_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Posted Date">
                <ColumnActions {...props}>
                    <DateFilter<IMutualFund>
                        displayText="Posted Date"
                        field="posted_date"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { posted_date },
            },
        }) => (
            <div className="flex items-start gap-2">
                <div>
                    <p>
                        {posted_date && (
                            <BadgeCheckFillIcon className="size-4 inline text-green-500 shrink-0 mr-1" />
                        )}
                        {posted_date ? toReadableDate(posted_date) : '-'}
                    </p>
                    {posted_date ? (
                        <p className="text-xs text-muted-foreground/60">
                            {toReadableDate(posted_date, 'h:mm a -')}{' '}
                            {dateAgo(posted_date)}
                        </p>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 170,
        minSize: 140,
    },
    ...createUpdateColumns<IMutualFund>(),
]

export default MutualFundTableColumns
