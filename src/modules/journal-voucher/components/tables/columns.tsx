import { cn } from '@/helpers'
import { IJournalVoucher } from '@/modules/journal-voucher'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

export const journalVoucherGlobalSearchTargets: IGlobalSearchTargets<IJournalVoucher>[] =
    [
        { field: 'voucher_number', displayText: 'Voucher Number' },
        { field: 'description', displayText: 'Description' },
        { field: 'reference', displayText: 'Reference' },
        { field: 'status', displayText: 'Status' },
    ]

export interface IJournalVoucherTableActionComponentProp {
    row: Row<IJournalVoucher>
}

export interface IJournalVoucherTableColumnProps {
    actionComponent?: (
        props: IJournalVoucherTableActionComponentProp
    ) => React.ReactNode
}

const JournalVoucherTableColumns = (
    opts?: IJournalVoucherTableColumnProps
): ColumnDef<IJournalVoucher>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className={'flex w-fit items-center gap-x-1 px-2'}>
                <HeaderToggleSelect table={table} />
                {!column.getIsPinned() && (
                    <PushPinIcon
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
        id: 'voucher_number',
        accessorKey: 'voucher_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Voucher Number" />
        ),
        cell: ({
            row: {
                original: { cash_voucher_number },
            },
        }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs text-muted-foreground/70">
                    {cash_voucher_number || '-'}
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
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description" />
        ),
        cell: ({
            row: {
                original: { description },
            },
        }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs text-muted-foreground/70">
                    {description || '-'}
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
        id: 'date',
        accessorKey: 'date',
        header: (props) => <DataTableColumnHeader {...props} title="Date" />,
        cell: ({
            row: {
                original: { date },
            },
        }) => (
            <div className="!text-wrap">
                {new Date(date).toLocaleDateString()}
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
        id: 'status',
        accessorKey: 'status',
        header: (props) => <DataTableColumnHeader {...props} title="Status" />,
        cell: ({ row: { original: journalVoucher } }) => {
            const status = journalVoucher.status
            let badgeColorClass = ''

            switch (status) {
                case 'posted':
                    badgeColorClass = 'bg-green-500 text-white'
                    break
                case 'cancelled':
                    badgeColorClass = 'bg-red-500 text-white'
                    break
                case 'draft':
                default:
                    badgeColorClass = 'bg-gray-500 text-white'
                    break
            }

            return (
                <Badge
                    className={cn(
                        '!text-wrap hover:bg-primary/20',
                        badgeColorClass
                    )}
                >
                    {status}
                </Badge>
            )
        },
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 80,
    },
    {
        id: 'total_debit',
        accessorKey: 'total_debit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Total Debit" />
        ),
        cell: ({
            row: {
                original: { total_debit },
            },
        }) => <div className="!text-wrap">{total_debit.toFixed(2)}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 120,
    },
    {
        id: 'total_credit',
        accessorKey: 'total_credit',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Total Credit" />
        ),
        cell: ({
            row: {
                original: { total_credit },
            },
        }) => <div className="!text-wrap">{total_credit.toFixed(2)}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 120,
    },
    {
        id: 'action-status',
        accessorKey: 'action-status',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Action Status" />
        ),
        cell: ({ row: { original: journalVoucher } }) => {
            const isPrinted = !!journalVoucher.printed_date
            const isApproved = !!journalVoucher.approved_date
            const isReleased = !!journalVoucher.released_date
            let statusLabel

            if (isReleased) {
                statusLabel = 'Released'
            } else if (isApproved) {
                statusLabel = 'Approved'
            } else if (isPrinted) {
                statusLabel = 'Printed'
            } else {
                statusLabel = 'Pending'
            }

            return (
                <Badge
                    className={cn('!text-wrap', {
                        'bg-green-500 text-white': isReleased,
                        'bg-blue-500 text-white': isApproved && !isReleased,
                        'bg-yellow-500 text-white': isPrinted && !isApproved,
                        'bg-gray-500 text-white': !isPrinted,
                    })}
                >
                    {statusLabel}
                </Badge>
            )
        },
        size: 150,
        minSize: 120,
    },
    {
        id: 'released_by',
        accessorKey: 'released_by',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Released By" />
        ),
        cell: ({
            row: {
                original: { posted_by },
            },
        }) => <div className="!text-wrap">{posted_by?.first_name ?? '-'}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 120,
    },

    // ... (Your other code)

    ...createUpdateColumns<IJournalVoucher>(),
]

export default JournalVoucherTableColumns
