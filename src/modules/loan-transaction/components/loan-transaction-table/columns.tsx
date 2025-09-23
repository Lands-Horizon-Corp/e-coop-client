import { ReactNode } from 'react'

import { formatNumber } from '@/helpers'
import { toReadableDateTime } from '@/helpers/date-utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon, RenderIcon, TIcon } from '@/components/icons'
import ImageNameDisplay from '@/components/image-name-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import {
    ILoanTransaction,
    TLoanCollectorPlace,
} from '../../loan-transaction.types'
import { LoanCollectorPlaceBadge } from '../loan-collector-place-badge'
import LoanStatusIndicator from '../loan-status-indicator'
import { LoanTypeBadge } from '../loan-type-badge'

export const loanStatusGlobalSearchTargets: IGlobalSearchTargets<ILoanTransaction>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'icon', displayText: 'Icon' },
    ]

export interface ILoanTransactionTableActionComponentProp {
    row: Row<ILoanTransaction>
}

export interface ILoanTransactionTableColumnProps {
    actionComponent?: (
        props: ILoanTransactionTableActionComponentProp
    ) => ReactNode
}

const LoanTransactionTableColumns = (
    opts?: ILoanTransactionTableColumnProps
): ColumnDef<ILoanTransaction>[] => {
    return [
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
            id: 'voucher',
            accessorKey: 'voucher',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Voucher">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Voucher"
                            field="voucher"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { voucher },
                },
            }) => (
                <div>
                    <CopyWrapper>{voucher}</CopyWrapper>
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
            id: 'passbook',
            accessorKey: 'member_profile.passbook',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Passbook No.">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Passbook"
                            field="member_profile.passbook"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { member_profile },
                },
            }) => (
                <span>
                    {member_profile?.passbook && (
                        <CopyWrapper>{member_profile?.passbook}</CopyWrapper>
                    )}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: false,
            enableHiding: false,
            size: 150,
            minSize: 150,
        },
        {
            id: 'member_profile.full_name',
            accessorKey: 'member_profile.full_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Member"
                            field="member_profile.full_name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { member_profile },
                },
            }) => (
                <div className="!text-wrap text-muted-foreground">
                    {member_profile && (
                        <ImageNameDisplay
                            src={member_profile.media_id}
                            name={member_profile.full_name}
                        />
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        {
            id: 'account.name',
            accessorKey: 'account.name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Account">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Account"
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
                <p className="!text-wrap text-muted-foreground">
                    {account && (
                        <>
                            <RenderIcon
                                icon={account.icon as TIcon}
                                className="inline mr-1"
                            />
                            <span>{account.name}</span>
                        </>
                    )}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        {
            id: 'application_status',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Application Status" />
            ),
            cell: ({ row: { original } }) => (
                <LoanStatusIndicator loanTransactionDates={original} />
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 180,
            minSize: 180,
            maxSize: 300,
        },
        {
            id: 'applied_1',
            accessorKey: 'applied_1',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Aplied Amount">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Applied Amount"
                            field="applied_1"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { applied_1 },
                },
            }) => (
                <p className="!text-wrap font-mono text-lg text-right text-muted-foreground">
                    {formatNumber(applied_1, 0, 1)}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 200,
            minSize: 200,
            maxSize: 400,
        },
        // {
        //     id: 'applied_2',
        //     accessorKey: 'applied_2',
        //     header: (props) => (
        //         <DataTableColumnHeader {...props} title="Aplied 2">
        //             <ColumnActions {...props}>
        //                 <TextFilter<ILoanTransaction>
        //                     displayText="Applied 2"
        //                     field="applied_2"
        //                 />
        //             </ColumnActions>
        //         </DataTableColumnHeader>
        //     ),
        //     cell: ({
        //         row: {
        //             original: { applied_2 },
        //         },
        //     }) => (
        //         <p className="!text-wrap text-right text-muted-foreground">
        //             {formatNumber(applied_2, 0, 1)}
        //         </p>
        //     ),
        //     enableMultiSort: true,
        //     enableSorting: true,
        //     enableResizing: true,
        //     enableHiding: true,
        //     size: 300,
        //     minSize: 300,
        //     maxSize: 800,
        // },
        {
            id: 'loan_type',
            accessorKey: 'loan_type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Loan Type">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Loan Type"
                            field="loan_type"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { loan_type },
                },
            }) => (
                <div className="!text-wrap text-muted-foreground">
                    {loan_type && <LoanTypeBadge loanType={loan_type} />}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        {
            id: 'loan_status',
            accessorKey: 'loan_status',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Status">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Status"
                            field="loan"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { loan_status },
                },
            }) => (
                <div className="!text-wrap text-muted-foreground">
                    {loan_status && (
                        <InfoTooltip content={loan_status.description}>
                            <Badge>
                                <span style={{ color: loan_status.color }}>
                                    <RenderIcon
                                        icon={loan_status.icon as TIcon}
                                        className="mr-1 size-3"
                                    />
                                    {loan_status.name}
                                </span>
                            </Badge>
                        </InfoTooltip>
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        {
            id: 'processor',
            accessorKey: 'employee_user',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Processor">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Processor"
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
                <div className="!text-wrap text-muted-foreground">
                    {employee_user && (
                        <ImageNameDisplay
                            src={employee_user.media_id}
                            name={employee_user.full_name}
                        />
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        {
            id: 'collector_place',
            accessorKey: 'collector_place',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Collector Place">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Collector Place"
                            field="collector_place"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { collector_place },
                },
            }) => (
                <div className="!text-wrap text-muted-foreground">
                    {collector_place && (
                        <LoanCollectorPlaceBadge
                            collectorPlace={
                                collector_place as TLoanCollectorPlace
                            }
                        />
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        {
            id: 'printed_date',
            accessorKey: 'printed_date',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Printed">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Printed Date"
                            field="printed_date"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { printed_date },
                },
            }) => (
                <p className="!text-wrap text-muted-foreground">
                    {printed_date && toReadableDateTime(printed_date)}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        {
            id: 'approved_date',
            accessorKey: 'approved_date',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Approved">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Approved Date"
                            field="approved_date"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { approved_date },
                },
            }) => (
                <p className="!text-wrap text-muted-foreground">
                    {approved_date && toReadableDateTime(approved_date)}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        {
            id: 'released_date',
            accessorKey: 'released_date',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Released">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Released Date"
                            field="released_date"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { released_date },
                },
            }) => (
                <p className="!text-wrap text-muted-foreground">
                    {released_date && toReadableDateTime(released_date)}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        ...createUpdateColumns<ILoanTransaction>(),
    ]
}

export default LoanTransactionTableColumns
