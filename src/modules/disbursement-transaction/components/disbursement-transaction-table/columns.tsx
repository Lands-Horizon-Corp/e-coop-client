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
import ImageNameDisplay from '@/components/image-name-display'
import { Checkbox } from '@/components/ui/checkbox'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { IDisbursementTransaction } from '../../disbursement-transaction.types'

export const disbursementTransactionGlobalSearchTargets: IGlobalSearchTargets<IDisbursementTransaction>[] =
    [
        { field: 'reference_number', displayText: 'Reference Number' },
        { field: 'disbursement.name', displayText: 'Disbursement Name' },
        { field: 'member_profile.full_name', displayText: 'Member Name' },
        { field: 'employee_user.full_name', displayText: 'Employee Name' },
        { field: 'status', displayText: 'Status' },
    ]

export interface IDisbursementTransactionTableActionComponentProp {
    row: Row<IDisbursementTransaction>
}

export interface IDisbursementTransactionTableColumnProps {
    actionComponent?: (
        props: IDisbursementTransactionTableActionComponentProp
    ) => ReactNode
}

const DisbursementTransactionTableColumns = (
    opts?: IDisbursementTransactionTableColumnProps
): ColumnDef<IDisbursementTransaction>[] => {
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
            id: 'reference_number',
            accessorKey: 'reference_number',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Reference Number">
                    <ColumnActions {...props}>
                        <TextFilter<IDisbursementTransaction>
                            displayText="Reference Number"
                            field="reference_number"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { reference_number },
                },
            }) => (
                <CopyWrapper>
                    <span className="font-mono text-sm">
                        {reference_number || '-'}
                    </span>
                </CopyWrapper>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 250,
            minSize: 250,
        },
        {
            id: 'amount',
            accessorKey: 'amount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Amount">
                    <ColumnActions {...props}>
                        <NumberFilter<IDisbursementTransaction>
                            displayText="Amount"
                            field="amount"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { amount, disbursement },
                },
            }) => (
                <p className="text-right font-medium">
                    {amount
                        ? currencyFormat(amount, {
                              currency: disbursement?.currency,
                              showSymbol: !!disbursement?.currency,
                          })
                        : '-'}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 200,
            minSize: 200,
        },
        {
            id: 'disburse',
            accessorKey: 'disbursement.name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Disbursement Name">
                    <ColumnActions {...props}>
                        <TextFilter<IDisbursementTransaction>
                            displayText="Disbursement Name"
                            field="disbursement.name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { disbursement },
                },
            }) => (
                <div className="relative">
                    {disbursement !== undefined ? (
                        <>
                            <p>{disbursement.name}</p>
                            <p className="!text-wrap">
                                {disbursement.description}
                            </p>
                        </>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 250,
            minSize: 250,
        },
        {
            id: 'transaction_batch',
            accessorKey: 'transaction_batch.batch_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Transaction Batch">
                    <ColumnActions {...props}>
                        <TextFilter<IDisbursementTransaction>
                            displayText="Transaction Batch"
                            field="transaction_batch.batch_name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { transaction_batch },
                },
            }) => (
                <div className="relative">
                    {transaction_batch !== undefined ? (
                        <>
                            <p>{transaction_batch.batch_name || 'No Name'}</p>
                            <CopyWrapper>
                                <p className="!text-wrap text-xs text-muted-foreground">
                                    {transaction_batch.id}
                                </p>
                            </CopyWrapper>
                        </>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 250,
            minSize: 250,
        },
        {
            id: 'employee_user',
            accessorKey: 'employee_user',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Employee/Teller">
                    <ColumnActions {...props}>
                        <TextFilter<IDisbursementTransaction>
                            displayText="Employee/Teller"
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
                <span className="relative">
                    {employee_user !== undefined ? (
                        <ImageNameDisplay
                            name={employee_user?.full_name}
                            src={employee_user?.media?.download_url}
                        />
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 250,
            minSize: 250,
        },
        ...createUpdateColumns<IDisbursementTransaction>(),
    ]
}

export default DisbursementTransactionTableColumns
