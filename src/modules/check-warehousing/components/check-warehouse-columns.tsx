import { toReadableDate } from '@/helpers/date-utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { ICheckWarehousing } from '../check-warehousing.types'

/**
 * 🔍 Global Search Targets
 */
export const checkWarehousingGlobalSearchTargets: IGlobalSearchTargets<ICheckWarehousing>[] =
    [
        { field: 'check_number', displayText: 'Check Number' },
        { field: 'reference_number', displayText: 'Reference Number' },
        { field: 'description', displayText: 'Description' },
    ]

export interface ICheckWarehousingTableActionComponentProp {
    row: Row<ICheckWarehousing>
}

export interface ICheckWarehousingTableColumnProps {
    actionComponent?: (
        props: ICheckWarehousingTableActionComponentProp
    ) => React.ReactNode
}

const CheckWarehousingTableColumns = (
    opts?: ICheckWarehousingTableColumnProps
): ColumnDef<ICheckWarehousing>[] => [
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
        minSize: 80,
    },

    {
        id: 'check_number',
        accessorKey: 'check_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Check Details">
                <ColumnActions {...props}>
                    <TextFilter<ICheckWarehousing>
                        displayText="Check Number"
                        field="check_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { check_number, media },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                <PreviewMediaWrapper media={media}>
                    <ImageDisplay
                        className="h-9 w-9 rounded-md border bg-muted object-cover shadow-sm"
                        src={media?.download_url}
                    />
                </PreviewMediaWrapper>
                <div className="flex flex-col">
                    <span className="truncate font-bold text-foreground">
                        {check_number || '-'}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Number
                    </span>
                </div>
            </div>
        ),
        size: 200,
    },

    // 2. FINANCIAL: The Money
    {
        id: 'amount',
        accessorKey: 'amount',
        header: (props) => <DataTableColumnHeader {...props} title="Amount" />,
        cell: ({
            row: {
                original: { amount },
            },
        }) => (
            <span className="font-bold text-primary">
                ₱{' '}
                {amount?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                })}
            </span>
        ),
        size: 140,
    },

    // 3. TIMING GROUP: When was it written?
    {
        id: 'check_date',
        accessorKey: 'check_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Check Date" />
        ),
        cell: ({ row }) => {
            const { check_date } = row.original
            return (
                <span className="whitespace-nowrap font-medium">
                    {check_date ? toReadableDate(check_date) : '-'}
                </span>
            )
        },
        size: 140,
    },
    {
        id: 'date_cleared',
        accessorKey: 'date_cleared',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Cleared" />
        ),
        cell: ({ row }) => {
            const { date_cleared } = row.original
            if (!date_cleared)
                return <span className="text-muted-foreground/50">-</span>
            return (
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-500" />{' '}
                    {/* Visual Status Dot */}
                    <span className="font-semibold text-green-700 dark:text-green-400">
                        {toReadableDate(date_cleared)}
                    </span>
                </div>
            )
        },
        size: 150,
    },

    // 4. PROCESS GROUP: When was it recorded and how long to clear?
    {
        id: 'date',
        accessorKey: 'date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Entry Date" />
        ),
        cell: ({ row }) => (
            <span className="text-muted-foreground italic">
                {row.original.date ? toReadableDate(row.original.date) : '-'}
            </span>
        ),
        size: 140,
    },

    {
        id: 'clear_days',
        accessorKey: 'clear_days',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Clearing" />
        ),
        cell: ({ row }) => {
            const { clear_days } = row.original
            return (
                <Badge variant="secondary" className="font-normal">
                    {clear_days} day(s)
                </Badge>
            )
        },
        size: 120,
    },

    // 5. METADATA: Secondary Searchable Info
    {
        id: 'reference_number',
        accessorKey: 'reference_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Ref #">
                <ColumnActions {...props}>
                    <TextFilter<ICheckWarehousing>
                        displayText="Reference"
                        field="reference_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <span className="font-mono text-xs uppercase">
                {row.original.reference_number || '-'}
            </span>
        ),
        size: 150,
    },

    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description" />
        ),
        cell: ({ row }) => (
            <div
                className="max-w-[200px] truncate text-muted-foreground italic"
                title={row.original.description}
            >
                {row.original.description || '-'}
            </div>
        ),
        size: 200,
    },

    ...createUpdateColumns<ICheckWarehousing>(),
]

export default CheckWarehousingTableColumns
