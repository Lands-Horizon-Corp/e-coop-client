import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { ILoanClearanceAnalysis } from '../../loan-clearance-analysis.types'

export const loanClearanceAnalysisGlobalSearchTargets: IGlobalSearchTargets<ILoanClearanceAnalysis>[] =
    [
        {
            field: 'regular_deduction_description',
            displayText: 'Regular Deduction Description',
        },
        { field: 'balances_description', displayText: 'Balances Description' },
        {
            field: 'regular_deduction_amount',
            displayText: 'Regular Deduction Amount',
        },
        { field: 'balances_amount', displayText: 'Balances Amount' },
    ]

export interface ILoanClearanceAnalysisTableActionComponentProp {
    row: Row<ILoanClearanceAnalysis>
}

export interface ILoanClearanceAnalysisTableColumnProps {
    actionComponent?: (
        props: ILoanClearanceAnalysisTableActionComponentProp
    ) => React.ReactNode
}

const LoanClearanceAnalysisTableColumns = (
    opts?: ILoanClearanceAnalysisTableColumnProps
): ColumnDef<ILoanClearanceAnalysis>[] => [
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
        id: 'regular_deduction_description',
        accessorKey: 'regular_deduction_description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Regular Deduction">
                <ColumnActions {...props}>
                    <TextFilter<ILoanClearanceAnalysis>
                        displayText="Regular Deduction Description"
                        field="regular_deduction_description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">
                    {original.regular_deduction_description || '-'}
                </span>
                <span className="text-xs text-muted-foreground">
                    ₱
                    {original.regular_deduction_amount?.toLocaleString() || '0'}
                </span>
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
        id: 'regular_deduction_amount',
        accessorKey: 'regular_deduction_amount',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Regular Amount">
                <ColumnActions {...props}>
                    <NumberFilter<ILoanClearanceAnalysis>
                        displayText="Regular Deduction Amount"
                        field="regular_deduction_amount"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="text-right font-mono">
                ₱{original.regular_deduction_amount?.toLocaleString() || '0.00'}
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
        id: 'balances_description',
        accessorKey: 'balances_description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Balances">
                <ColumnActions {...props}>
                    <TextFilter<ILoanClearanceAnalysis>
                        displayText="Balances Description"
                        field="balances_description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">
                    {original.balances_description || '-'}
                </span>
                <span className="text-xs text-muted-foreground">
                    Count: {original.balances_count || 0}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 200,
        minSize: 150,
    },
    {
        id: 'balances_amount',
        accessorKey: 'balances_amount',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Balance Amount">
                <ColumnActions {...props}>
                    <NumberFilter<ILoanClearanceAnalysis>
                        displayText="Balances Amount"
                        field="balances_amount"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="text-right font-mono">
                ₱{original.balances_amount?.toLocaleString() || '0.00'}
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
        id: 'balances_count',
        accessorKey: 'balances_count',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Count">
                <ColumnActions {...props}>
                    <NumberFilter<ILoanClearanceAnalysis>
                        displayText="Balances Count"
                        field="balances_count"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="text-center font-mono">
                {original.balances_count || 0}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 100,
        minSize: 80,
    },
    ...createUpdateColumns<ILoanClearanceAnalysis>(),
]

export default LoanClearanceAnalysisTableColumns
