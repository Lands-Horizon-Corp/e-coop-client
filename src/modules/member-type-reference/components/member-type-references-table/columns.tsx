// columns.tsx
import { ReactNode } from 'react'

import { formatNumber } from '@/helpers/number-utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IMemberTypeReference } from '../../member-type-reference.types'

export const memberTypeReferenceGlobalSearchTargets: IGlobalSearchTargets<IMemberTypeReference>[] =
    [
        { field: 'description', displayText: 'Description' },
        { field: 'member_type.name', displayText: 'Member Type' },
        { field: 'account.name', displayText: 'Account' },
    ]

export interface IMemberTypeReferenceTableActionComponentProp {
    row: Row<IMemberTypeReference>
}

export interface IMemberTypeReferenceTableColumnProps {
    actionComponent?: (
        props: IMemberTypeReferenceTableActionComponentProp
    ) => ReactNode
}

const MemberTypeReferenceTableColumns = (
    opts?: IMemberTypeReferenceTableColumnProps
): ColumnDef<IMemberTypeReference>[] => [
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
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter displayText="Description" field="description" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="truncate">{original.description}</div>
        ),
        enableSorting: true,
        enableResizing: true,
        enableMultiSort: true,
        size: 220,
        minSize: 180,
    },
    {
        id: 'member_type',
        accessorKey: 'member_type.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Member Type">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div>{original.member_type?.name || '-'}</div>
        ),
        enableSorting: true,
        enableResizing: true,
        size: 180,
        minSize: 160,
    },
    {
        id: 'account',
        accessorKey: 'account.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Account">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div>{original.account?.name || '-'}</div>
        ),
        enableSorting: true,
        enableResizing: true,
        size: 180,
        minSize: 160,
    },
    {
        id: 'interest_rate',
        accessorKey: 'interest_rate',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Interest Rate">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <div>{formatNumber(row.original.interest_rate, 2)}%</div>
        ),
        size: 150,
    },
    {
        id: 'charges',
        accessorKey: 'charges',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Charges">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{formatNumber(row.original.charges, 2)}</div>,
        size: 150,
    },
    ...createUpdateColumns<IMemberTypeReference>(),
]

export default MemberTypeReferenceTableColumns
