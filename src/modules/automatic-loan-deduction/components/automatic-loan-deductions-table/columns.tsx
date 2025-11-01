// columns.tsx
import { ReactNode } from 'react'

import { formatNumber } from '@/helpers/number-utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import YesNoBadge from '@/components/badges/yes-no-badge'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IAutomaticLoanDeduction } from '../../automatic-loan-deduction.types'

export const automaticLoanDeductionGlobalSearchTargets: IGlobalSearchTargets<IAutomaticLoanDeduction>[] =
    [
        { field: 'description', displayText: 'Description' },
        { field: 'icon', displayText: 'Icon' },
    ]

export interface IAutomaticLoanDeductionTableActionComponentProp {
    row: Row<IAutomaticLoanDeduction>
}

export interface IAutomaticLoanDeductionTableColumnProps {
    actionComponent?: (
        props: IAutomaticLoanDeductionTableActionComponentProp
    ) => ReactNode
}

const AutomaticLoanDeductionColumns = (
    opts?: IAutomaticLoanDeductionTableColumnProps
): ColumnDef<IAutomaticLoanDeduction>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className="flex w-fit items-center gap-x-1 px-2">
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
    },
    {
        id: 'account',
        accessorKey: 'account.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Account">
                <ColumnActions {...props}>
                    <TextFilter<IAutomaticLoanDeduction>
                        displayText="Account"
                        field="account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.account.name}</div>,
        size: 200,
    },
    {
        id: 'charges_percent_1',
        accessorKey: 'charges_percentage_1',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Charge % #1">
                <ColumnActions {...props}>
                    <NumberFilter<IAutomaticLoanDeduction>
                        displayText="Charge % #1"
                        field="charges_percentage_1"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>{formatNumber(row.original.charges_percentage_1)} %</div>
        ),
        size: 200,
    },
    {
        id: 'charges_percent_2',
        accessorKey: 'charges_percentage_2',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Charge % #2">
                <ColumnActions {...props}>
                    <NumberFilter<IAutomaticLoanDeduction>
                        displayText="Charge % #2"
                        field="charges_percentage_2"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>{formatNumber(row.original.charges_percentage_2)} %</div>
        ),
        size: 200,
    },
    {
        id: 'charges_amount',
        accessorKey: 'charges_amount',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Charge Amount">
                <ColumnActions {...props}>
                    <NumberFilter<IAutomaticLoanDeduction>
                        displayText="Charge Amount"
                        field="charges_amount"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>{formatNumber(row.original.charges_amount)}</div>
        ),
        size: 200,
    },
    {
        id: 'divisor',
        accessorKey: 'charges_divisor',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Charge Divisor">
                <ColumnActions {...props}>
                    <NumberFilter<IAutomaticLoanDeduction>
                        displayText="Charge Divisor"
                        field="charges_divisor"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>{formatNumber(row.original.charges_divisor)}</div>
        ),
        size: 200,
    },
    {
        id: 'min_amount',
        accessorKey: 'min_amount',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Min. Amount">
                <ColumnActions {...props}>
                    <NumberFilter<IAutomaticLoanDeduction>
                        displayText="Min. Amount"
                        field="min_amount"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{formatNumber(row.original.min_amount)}</div>,
        size: 200,
    },

    {
        id: 'max_amount',
        accessorKey: 'max_amount',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Max Amount">
                <ColumnActions {...props}>
                    <NumberFilter<IAutomaticLoanDeduction>
                        displayText="Max Amount"
                        field="max_amount"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{formatNumber(row.original.max_amount)}</div>,
        size: 200,
    },

    {
        id: 'anum',
        accessorKey: 'anum',
        header: (props) => <DataTableColumnHeader {...props} title="ANum" />,
        cell: ({ row }) => <div>{row.original.anum}</div>,
        size: 150,
    },
    {
        id: 'charges_rate_scheme_id.name',
        accessorKey: 'charges_rate_scheme_id.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Charges Rate Scheme">
                <ColumnActions {...props}>
                    <TextFilter<IAutomaticLoanDeduction>
                        displayText="Charges Rate Scheme"
                        field="charges_rate_scheme_id.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.charges_rate_scheme?.name}</div>,
        size: 200,
    },

    {
        id: 'add_on',
        accessorKey: 'add_on',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Add-On">
                <ColumnActions {...props}>
                    <DataTableMultiSelectFilter<
                        IAutomaticLoanDeduction,
                        boolean
                    >
                        dataType="boolean"
                        displayText="Add-On"
                        field="add_on"
                        mode="equal"
                        multiSelectOptions={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>
                <YesNoBadge value={row.original.add_on} />
            </div>
        ),
        size: 150,
    },
    {
        id: 'ao_rest',
        accessorKey: 'ao_rest',
        header: (props) => (
            <DataTableColumnHeader {...props} title="AO Rest">
                <ColumnActions {...props}>
                    <DataTableMultiSelectFilter<
                        IAutomaticLoanDeduction,
                        boolean
                    >
                        dataType="boolean"
                        displayText="Add-On Rest"
                        field="ao_rest"
                        mode="equal"
                        multiSelectOptions={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>
                <YesNoBadge value={row.original.ao_rest} />
            </div>
        ),
        size: 150,
    },
    {
        id: 'exclude_renewal',
        accessorKey: 'exclude_renewal',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Exclude Renewal">
                <ColumnActions {...props}>
                    <DataTableMultiSelectFilter<
                        IAutomaticLoanDeduction,
                        boolean
                    >
                        dataType="boolean"
                        displayText="Exclude Renewal"
                        field="exclude_renewal"
                        mode="equal"
                        multiSelectOptions={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                        ]}
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>
                <YesNoBadge value={row.original.exclude_renewal} />
            </div>
        ),
        size: 200,
    },
    {
        id: 'ct',
        accessorKey: 'ct',
        header: (props) => (
            <DataTableColumnHeader {...props} title="CT">
                <ColumnActions {...props}>
                    <NumberFilter<IAutomaticLoanDeduction>
                        displayText="CT"
                        field="ct"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{formatNumber(row.original.ct)}</div>,
        size: 200,
    },
    ...createUpdateColumns<IAutomaticLoanDeduction>(),
]

export default AutomaticLoanDeductionColumns
