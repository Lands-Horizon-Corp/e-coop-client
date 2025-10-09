import { ReactNode } from 'react'

import { formatNumber } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import { RenderIcon, TIcon, TagIcon } from '@/components/icons'
import ImageNameDisplay from '@/components/image-name-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import {
    ILoanTransaction,
    TLoanCollectorPlace,
} from '../../loan-transaction.types'
import { LoanCollectorPlaceBadge } from '../loan-collector-place-badge'
import LoanStatusIndicator from '../loan-status-indicator'
import { LoanTagChip, LoanTagsManagerPopover } from '../loan-tag-manager'

export const memberLoanTableSummaryGlobalSearchTargets: IGlobalSearchTargets<ILoanTransaction>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'icon', displayText: 'Icon' },
    ]

export interface IMemberLoanTableSummaryActionComponentProp {
    row: Row<ILoanTransaction>
}

export interface IMemberLoanTableSummaryColumnProps {
    actionComponent?: (
        props: IMemberLoanTableSummaryActionComponentProp
    ) => ReactNode
}

const MemberLoanTableSummaryColumns = (
    _opts?: IMemberLoanTableSummaryColumnProps
): ColumnDef<ILoanTransaction>[] => {
    return [
        // {
        //     id: 'select',
        //     header: ({ column }) => (
        //         <div className={'flex w-fit items-center gap-x-1 px-2'}>
        //             {/* <HeaderToggleSelect table={table} /> */}
        //             {!column.getIsPinned() && (
        //                 <PushPinSlashIcon
        //                     onClick={() => column.pin('left')}
        //                     className="mr-2 size-3.5 cursor-pointer"
        //                 />
        //             )}
        //         </div>
        //     ),
        //     cell: ({ row }) => (
        //         <div className="flex w-fit items-center gap-x-1 px-0">
        //             {opts?.actionComponent?.({ row })}
        //             {/* <Checkbox
        //                 aria-label="Select row"
        //                 checked={row.getIsSelected()}
        //                 onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             /> */}
        //         </div>
        //     ),
        //     enableSorting: false,
        //     enableResizing: false,
        //     enableHiding: false,
        //     size: 80,
        //     minSize: 80,
        // },
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
                                className="inline mr-1"
                                icon={account.icon as TIcon}
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
            id: 'count',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Count" />
            ),
            cell: ({
                row: {
                    original: { count },
                },
            }) => count,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 100,
            minSize: 100,
            maxSize: 300,
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
                            <Badge className="font-normal" variant="outline">
                                <span>
                                    <RenderIcon
                                        className="mr-1 inline size-3"
                                        icon={loan_status.icon as TIcon}
                                        style={{ color: loan_status.color }}
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
            id: 'balance',
            accessorKey: 'balance',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Balance">
                    <ColumnActions {...props}>
                        <NumberFilter<ILoanTransaction>
                            displayText="Balance"
                            field="balance"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { balance },
                },
            }) => (
                <div className="!text-wrap text-muted-foreground">
                    {balance}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 200,
            minSize: 200,
            maxSize: 800,
        },
        {
            id: 'last_pay',
            accessorKey: 'last_pay',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Loan Type">
                    <ColumnActions {...props}>
                        <NumberFilter<ILoanTransaction>
                            displayText="Last Pay"
                            field="last_pay"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { last_pay },
                },
            }) => (
                <div className="!text-wrap text-muted-foreground">
                    {last_pay}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 250,
            minSize: 250,
            maxSize: 800,
        },
        {
            id: 'interest',
            accessorKey: 'interest',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Interest">
                    <ColumnActions {...props}>
                        <NumberFilter<ILoanTransaction>
                            displayText="Interest"
                            field="interest"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { interest },
                },
            }) => (
                <div className="!text-wrap text-muted-foreground">
                    {interest}
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
            id: 'fines',
            accessorKey: 'fines',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Fines">
                    <ColumnActions {...props}>
                        <NumberFilter<ILoanTransaction>
                            displayText="Fines"
                            field="fines"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { fines },
                },
            }) => (
                <div className="!text-wrap text-muted-foreground">{fines}</div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 200,
            minSize: 200,
            maxSize: 400,
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
            id: 'terms',
            accessorKey: 'terms',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Terms">
                    <ColumnActions {...props}>
                        <NumberFilter<ILoanTransaction>
                            displayText="Terms"
                            field="terms"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { terms },
                },
            }) => (
                <div className="!text-wrap text-muted-foreground">{terms}</div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 200,
            minSize: 200,
            maxSize: 400,
        },
        {
            id: 'loan_tags',
            accessorKey: 'loan_tags',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Loan Tags">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { loan_tags = [] },
                },
            }) => (
                <div className="flex gap-1.5 flex-wrap items-baseline">
                    {loan_tags.slice(0, 3).map((tag) => (
                        <LoanTagChip key={tag.id} size="sm" tag={tag} />
                    ))}
                    {loan_tags.length > 3 && (
                        <LoanTagsManagerPopover
                            defaultLoanTags={loan_tags}
                            loanTransactionId={''}
                            readOnly
                        >
                            <Button
                                className="size-fit !p-0 border-none cursor-pointer text-xs !bg-transparent !py-0.5 !px-1.5"
                                size="sm"
                                type="button"
                                variant="outline"
                            >
                                <TagIcon />{' '}
                                <span>{loan_tags.length - 1} more...</span>
                            </Button>
                        </LoanTagsManagerPopover>
                    )}
                </div>
            ),
            enableMultiSort: false,
            enableSorting: false,
            enableResizing: true,
            enableHiding: true,
            size: 500,
            minSize: 500,
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
                            name={employee_user.full_name}
                            src={employee_user.media_id}
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
                            size="sm"
                        />
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 160,
            minSize: 160,
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
                <div className="!text-wrap">
                    <p>{printed_date ? toReadableDate(printed_date) : ''} </p>
                    {printed_date ? (
                        <p className="text-xs text-muted-foreground/60">
                            {toReadableDate(printed_date, 'h:mm a -')}{' '}
                            {dateAgo(printed_date)}
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
                <div className="!text-wrap">
                    <p>{approved_date ? toReadableDate(approved_date) : ''} </p>
                    {approved_date ? (
                        <p className="text-xs text-muted-foreground/60">
                            {toReadableDate(approved_date, 'h:mm a -')}{' '}
                            {dateAgo(approved_date)}
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
                <div className="!text-wrap">
                    <p>{released_date ? toReadableDate(released_date) : ''} </p>
                    {released_date ? (
                        <p className="text-xs text-muted-foreground/60">
                            {toReadableDate(released_date, 'h:mm a -')}{' '}
                            {dateAgo(released_date)}
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
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        ...createUpdateColumns<ILoanTransaction>(),
    ]
}

export default MemberLoanTableSummaryColumns
