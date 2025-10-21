import { ReactNode } from 'react'

import { toReadableDateTime } from '@/helpers/date-utils'
import { currencyFormat } from '@/modules/currency'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import ImageNameDisplay from '@/components/image-name-display'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { ITransactionBatch } from '../../transaction-batch.types'

// Define which fields can be searched globally
export const batchGlobalSearchTargets: IGlobalSearchTargets<ITransactionBatch>[] =
    [
        { field: 'batch_name', displayText: 'Batch Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'employee_user.employee_id', displayText: 'Employee ID' },
        { field: 'employee_user.full_name', displayText: 'Employee Name' }, // assuming IUserBase has full_name
        { field: 'branch.name', displayText: 'Branch' },
        { field: 'organization.name', displayText: 'Organization' },
    ]

export interface ITransactionBatchTableActionComponentProp {
    row: Row<ITransactionBatch>
}

export interface ITransactionBatchTableColumnProps {
    actionComponent?: (
        props: ITransactionBatchTableActionComponentProp
    ) => ReactNode
}

const TransactionBatchTableColumns = (
    opts?: ITransactionBatchTableColumnProps
): ColumnDef<ITransactionBatch>[] => {
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
            id: 'batch_name',
            accessorKey: 'batch_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Batch Name">
                    <ColumnActions {...props}>
                        <TextFilter<ITransactionBatch>
                            displayText="Batch Name"
                            field="batch_name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { batch_name },
                },
            }) => (
                <div>
                    {!batch_name || batch_name.length === 0 ? (
                        <span className="text-xs text-muted-foreground/70 italic">
                            no batch name
                        </span>
                    ) : (
                        batch_name
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
        {
            id: 'employee_user',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Employee">
                    <ColumnActions {...props}>
                        <TextFilter<ITransactionBatch>
                            displayText="Employee Name"
                            field="employee_user.full_name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { employee_user },
                },
            }) => (
                <div className="space-y-1">
                    <ImageNameDisplay
                        name={employee_user.full_name}
                        src={employee_user.media?.download_url}
                    />
                    <p className="text-muted-foreground/80 text-xs">
                        {employee_user.email}
                    </p>
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 180,
            minSize: 120,
        },
        {
            id: 'beginning_balance',
            accessorKey: 'beginning_balance',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Beginning Balance" />
            ),
            cell: ({
                row: {
                    original: { beginning_balance, currency },
                },
            }) => (
                <div className="text-right">
                    {currencyFormat(beginning_balance, {
                        currency,
                        showSymbol: !!currency,
                    })}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 120,
            minSize: 160,
        },
        {
            id: 'deposit_in_bank',
            accessorKey: 'deposit_in_bank',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Deposit in Bank" />
            ),
            cell: ({
                row: {
                    original: { deposit_in_bank, currency },
                },
            }) => (
                <div className="text-right">
                    {currencyFormat(deposit_in_bank, {
                        currency,
                        showSymbol: !!currency,
                    })}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 120,
            minSize: 140,
        },
        {
            id: 'cash_count_total',
            accessorKey: 'cash_count_total',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Cash Count Total" />
            ),
            cell: ({
                row: {
                    original: { cash_count_total, currency },
                },
            }) => (
                <div className="text-right">
                    {currencyFormat(cash_count_total, {
                        currency,
                        showSymbol: !!currency,
                    })}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 120,
            minSize: 150,
        },
        {
            id: 'grand_total',
            accessorKey: 'grand_total',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Grand Total" />
            ),
            cell: ({
                row: {
                    original: { grand_total, currency },
                },
            }) => (
                <div className="text-right">
                    {currencyFormat(grand_total, {
                        currency,
                        showSymbol: !!currency,
                    })}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 160,
            minSize: 160,
        },
        {
            id: 'ended',
            accessorKey: 'is_closed',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Ended" />
            ),
            cell: ({
                row: {
                    original: { is_closed },
                },
            }) => (
                <div>
                    {is_closed ? (
                        <Badge
                            className="bg-primary/20 border-primary/20"
                            variant="success"
                        >
                            Ended
                        </Badge>
                    ) : (
                        <Badge
                            className="border-amber-400/40 bg-amber-200/40"
                            variant="warning"
                        >
                            Ongoing
                        </Badge>
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 120,
            minSize: 120,
        },
        {
            id: 'blotter_view',
            accessorKey: 'can_view',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Blotter View" />
            ),
            cell: ({
                row: {
                    original: { can_view },
                },
            }) => (
                <div>
                    {can_view ? (
                        <Badge
                            className="bg-primary/20 border-primary/20"
                            variant="success"
                        >
                            Yes
                        </Badge>
                    ) : (
                        <Badge
                            className="border-secondary bg-secondary/60"
                            variant="secondary"
                        >
                            No
                        </Badge>
                    )}
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
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<ITransactionBatch>
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
            }) => (
                <p className="!text-wrap text-muted-foreground">
                    {description ?? '-'}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 200,
            minSize: 120,
            maxSize: 800,
        },
        {
            id: 'started_at',
            accessorKey: 'created_at',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Started At">
                    <ColumnActions {...props}>
                        <DateFilter
                            displayText="Started At"
                            field="created_at"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { created_at },
                },
            }) => <div>{created_at ? toReadableDateTime(created_at) : ''}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 200,
            minSize: 200,
        },
        {
            id: 'ended_at',
            accessorKey: 'ended_at',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Ended At">
                    <ColumnActions {...props}>
                        <DateFilter displayText="Ended At" field="ended_at" />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { ended_at },
                },
            }) => <div>{ended_at ? toReadableDateTime(ended_at) : ''}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 200,
            minSize: 200,
        },
        ...createUpdateColumns<ITransactionBatch>(),
    ]
}

export default TransactionBatchTableColumns
