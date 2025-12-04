import { ReactNode } from 'react'

import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { currencyFormat } from '@/modules/currency'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import {
    BadgeCheckFillIcon,
    PushPinSlashIcon,
    RenderIcon,
    TIcon,
} from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IGeneratedSavingsInterest } from '../../../generated-savings-interest.types'

export const generatedSavingsInterestGlobalSearchTargets: IGlobalSearchTargets<IGeneratedSavingsInterest>[] =
    [
        { field: 'document_no', displayText: 'Document No.' },
        { field: 'account.name', displayText: 'Account Name' },
        { field: 'member_type.name', displayText: 'Member Type' },
    ]

export interface IGeneratedSavingsInterestTableActionComponentProp {
    row: Row<IGeneratedSavingsInterest>
}

export interface IGeneratedSavingsInterestTableColumnProps {
    actionComponent?: (
        props: IGeneratedSavingsInterestTableActionComponentProp
    ) => ReactNode
}

const GeneratedSavingsInterestTableColumns = (
    opts?: IGeneratedSavingsInterestTableColumnProps
): ColumnDef<IGeneratedSavingsInterest>[] => [
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
        id: 'document_no',
        accessorKey: 'document_no',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Document No.">
                <ColumnActions {...props}>
                    <TextFilter<IGeneratedSavingsInterest>
                        displayText="Document No."
                        field="document_no"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { document_no },
            },
        }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-semibold">
                    {document_no || '-'}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 120,
    },
    {
        id: 'last_computation_date',
        accessorKey: 'last_computation_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Last Comp. Date">
                <ColumnActions {...props}>
                    <DateFilter<IGeneratedSavingsInterest>
                        displayText="Last Comp. Date"
                        field="last_computation_date"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { last_computation_date },
            },
        }) => (
            <div>
                <p>
                    {last_computation_date
                        ? toReadableDate(last_computation_date)
                        : ''}{' '}
                </p>
                {last_computation_date ? (
                    <p className="text-xs text-muted-foreground/60">
                        {toReadableDate(last_computation_date, 'h:mm a -')}{' '}
                        {dateAgo(last_computation_date)}
                    </p>
                ) : (
                    ''
                )}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 150,
        minSize: 120,
    },
    {
        id: 'new_computation_date',
        accessorKey: 'new_computation_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="New Comp. Date">
                <ColumnActions {...props}>
                    <DateFilter<IGeneratedSavingsInterest>
                        displayText="New Comp. Date"
                        field="new_computation_date"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { new_computation_date },
            },
        }) => (
            <div>
                <p>
                    {new_computation_date
                        ? toReadableDate(new_computation_date)
                        : ''}{' '}
                </p>
                {new_computation_date ? (
                    <p className="text-xs text-muted-foreground/60">
                        {toReadableDate(new_computation_date, 'h:mm a -')}{' '}
                        {dateAgo(new_computation_date)}
                    </p>
                ) : (
                    ''
                )}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 150,
        minSize: 120,
    },
    {
        id: 'account',
        accessorKey: 'account.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Account">
                <ColumnActions {...props}>
                    <TextFilter<IGeneratedSavingsInterest>
                        displayText="Account Name"
                        field="account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { account },
            },
        }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">
                    <RenderIcon
                        className="inline mr-1"
                        icon={account?.icon as TIcon}
                    />
                    {account?.name || 'All Accounts'}
                </span>
                {account?.description && (
                    <span className="truncate text-xs text-muted-foreground/70">
                        {account.description}
                    </span>
                )}
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
        id: 'member_type',
        accessorKey: 'member_type.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Member Type">
                <ColumnActions {...props}>
                    <TextFilter<IGeneratedSavingsInterest>
                        displayText="Member Type"
                        field="member_type.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { member_type },
            },
        }) => (
            <div>
                <span className="text-sm">
                    {member_type?.name || 'All Types'}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 150,
        minSize: 120,
    },
    {
        id: 'total_interest',
        accessorKey: 'total_interest',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Total Interest">
                <ColumnActions {...props}>
                    <NumberFilter<IGeneratedSavingsInterest>
                        displayText="Total Interest"
                        field="total_interest"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { total_interest },
            },
        }) => (
            <div>
                <span className="text-sm font-semibold">
                    {currencyFormat(total_interest)}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 150,
        minSize: 120,
    },
    {
        id: 'total_tax',
        accessorKey: 'total_tax',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Total Tax">
                <ColumnActions {...props}>
                    <NumberFilter<IGeneratedSavingsInterest>
                        displayText="Total Tax"
                        field="total_tax"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { total_tax },
            },
        }) => (
            <div>
                <span className="text-sm font-semibold">
                    {currencyFormat(total_tax)}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 120,
        minSize: 100,
    },
    {
        id: 'interest_tax_rate',
        accessorKey: 'interest_tax_rate',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Tax Rate %">
                <ColumnActions {...props}>
                    <NumberFilter<IGeneratedSavingsInterest>
                        displayText="Tax Rate"
                        field="interest_tax_rate"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { interest_tax_rate },
            },
        }) => (
            <div>
                <span className="text-sm">{interest_tax_rate}%</span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 120,
        minSize: 100,
    },
    {
        id: 'posted_date',
        accessorKey: 'posted_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Posted Date">
                <ColumnActions {...props}>
                    <DateFilter<IGeneratedSavingsInterest>
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

    ...createUpdateColumns<IGeneratedSavingsInterest>(),
]

export default GeneratedSavingsInterestTableColumns
