import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
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
            <DataTableColumnHeader {...props} title="Check">
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
                        className="h-9 w-9 rounded-md border bg-muted object-cover"
                        src={media?.download_url}
                    />
                </PreviewMediaWrapper>
                <span className="truncate font-semibold">
                    {check_number || '-'}
                </span>
            </div>
        ),
        enableSorting: true,
        enableResizing: true,
        size: 180,
        minSize: 150,
    },

    {
        id: 'amount',
        accessorKey: 'amount',
        header: (props) => <DataTableColumnHeader {...props} title="Amount" />,
        cell: ({
            row: {
                original: { amount },
            },
        }) => <span className="font-medium">₱ {amount?.toLocaleString()}</span>,
        enableSorting: true,
        size: 140,
        minSize: 120,
    },

    {
        id: 'check_date',
        accessorKey: 'check_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Check Date" />
        ),
        cell: ({ row }) => {
            const { check_date } = row.original
            return <span>{check_date || '-'}</span>
        },
        enableSorting: true,
        size: 140,
    },

    {
        id: 'clear_days',
        accessorKey: 'clear_days',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Clear Days" />
        ),
        cell: ({ row }) => {
            const { clear_days } = row.original
            return <span>{clear_days} day(s)</span>
        },
        enableSorting: true,
        size: 120,
    },

    {
        id: 'reference_number',
        accessorKey: 'reference_number',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Reference">
                <ColumnActions {...props}>
                    <TextFilter<ICheckWarehousing>
                        displayText="Reference Number"
                        field="reference_number"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <span>{row.original.reference_number || '-'}</span>,
        enableSorting: true,
        size: 180,
    },

    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<ICheckWarehousing>
                        displayText="Description"
                        field="description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div className="text-wrap!">{row.original.description || '-'}</div>
        ),
        enableSorting: true,
        size: 220,
    },

    {
        id: 'date',
        accessorKey: 'date',
        header: (props) => <DataTableColumnHeader {...props} title="Date" />,
        cell: ({ row }) => <span>{row.original.date || '-'}</span>,
        enableSorting: true,
        size: 140,
    },

    ...createUpdateColumns<ICheckWarehousing>(),
]

export default CheckWarehousingTableColumns
