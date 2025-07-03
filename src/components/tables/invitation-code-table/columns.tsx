import { toReadableDate, toReadableDateShort } from '@/utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IInvitationCode } from '@/types'

import InvitationCodeAction from './action'

export const InvitationCodeGlobalSearchTargets: IGlobalSearchTargets<IInvitationCode>[] =
    [
        { field: 'code', displayText: 'Invitation Code' },
        { field: 'description', displayText: 'Description' },
    ]

export interface IInvitationTableActionComponentProp {
    row: Row<IInvitationCode>
}

export interface IInvitationCodeTableColumnProps {
    actionComponent?: (
        props: IInvitationTableActionComponentProp
    ) => React.ReactNode
}

const InvitationCodeTableColumns = (
    opts?: IInvitationCodeTableColumnProps
): ColumnDef<IInvitationCode>[] => [
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
        id: 'code',
        accessorKey: 'Code',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Code">
                <ColumnActions {...props}>
                    <TextFilter<IInvitationCode>
                        displayText="Code"
                        field="code"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { code },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                <span className="truncate text-xs text-muted-foreground/70">
                    {code || '-'}
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
        id: 'expiry',
        accessorKey: 'expiration_date',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Expiration Date">
                <ColumnActions {...props}>
                    <DateFilter
                        displayText="Date Created"
                        field="expiration_date"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { expiration_date },
            },
        }) => (
            <div>
                {expiration_date ? toReadableDateShort(expiration_date) : ''}
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
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IInvitationCode>
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
        }) => <div>{description}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 180,
    },
    {
        id: 'max_uses',
        accessorKey: 'max uses',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Max Uses">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { max_use },
            },
        }) => (
            <span className="text-sm font-semibold">
                {max_use !== undefined ? max_use : '-'}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 150,
    },
    {
        id: 'current_uses',
        accessorKey: 'curent uses',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Current Uses">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { current_use },
            },
        }) => (
            <span className="text-sm font-semibold">
                {current_use !== undefined ? current_use : '-'}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 150,
    },

    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Created">
                <ColumnActions {...props}>
                    <DateFilter displayText="Date Updated" field="created_at" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { created_at },
            },
        }) => <div>{created_at ? toReadableDate(created_at) : ''}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 180,
    },

    {
        id: 'updated_at',
        accessorKey: 'updated_at',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Date Updated">
                <ColumnActions {...props}>
                    <DateFilter displayText="Date Updated" field="updated_at" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { updated_at },
            },
        }) => <div>{updated_at ? toReadableDate(updated_at) : ''}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 180,
    },
    {
        id: 'actions',
        header: () => null,
        cell: ({ row }) => <InvitationCodeAction row={row} />,
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 80,
        minSize: 80,
    },
]

export default InvitationCodeTableColumns
