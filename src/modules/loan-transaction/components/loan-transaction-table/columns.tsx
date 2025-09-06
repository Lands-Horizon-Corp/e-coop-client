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
            id: 'voucher_no',
            accessorKey: 'voucher_no',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Voucher No.">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Voucher No."
                            field="voucher_no"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { voucher_no },
                },
            }) => (
                <div>
                    <CopyWrapper>{voucher_no}</CopyWrapper>
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
                <p className="!text-wrap text-muted-foreground">
                    {member_profile && (
                        <ImageNameDisplay
                            src={member_profile.media_id}
                            name={member_profile.full_name}
                        />
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
                            <RenderIcon icon={account.icon as TIcon} />
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
                <p className="!text-wrap text-muted-foreground">
                    {employee_user && (
                        <ImageNameDisplay
                            src={employee_user.media_id}
                            name={employee_user.full_name}
                        />
                    )}
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
                <p className="!text-wrap text-muted-foreground">
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
            id: 'applied_1',
            accessorKey: 'applied_1',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Aplied 1">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Applied 1"
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
                <p className="!text-wrap text-right text-muted-foreground">
                    {formatNumber(applied_1, 0, 1)}
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
            id: 'applied_2',
            accessorKey: 'applied_2',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Aplied 2">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanTransaction>
                            displayText="Applied 2"
                            field="applied_2"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { applied_2 },
                },
            }) => (
                <p className="!text-wrap text-right text-muted-foreground">
                    {formatNumber(applied_2, 0, 1)}
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
                <p className="!text-wrap text-muted-foreground">
                    {loan_type && <LoanTypeBadge loanType={loan_type} />}
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
                <p className="!text-wrap text-muted-foreground">
                    {collector_place && (
                        <LoanCollectorPlaceBadge
                            collectorPlace={
                                collector_place as TLoanCollectorPlace
                            }
                        />
                    )}
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
                <DataTableColumnHeader {...props} title="Approved Date">
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
        ...createUpdateColumns<ILoanTransaction>(),
    ]
}

export default LoanTransactionTableColumns
