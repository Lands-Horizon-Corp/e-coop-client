import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { PushPinSlashIcon } from '@/components/icons'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'
import { IAccountsComputationTypeResource } from '@/types/coop-types/accounts/computation-type'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'

export const accountComputationTypeGlobalSearchTargets: IGlobalSearchTargets<IAccountsComputationTypeResource>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'description', displayText: 'Description' },
    ]

export interface IAccountsComputationTypeTableActionComponentProp {
    row: Row<IAccountsComputationTypeResource>
}

export interface IAccountsComputationTypeTableColumnProps {
    actionComponent?: (
        props: IAccountsComputationTypeTableActionComponentProp
    ) => ReactNode
}

const AccountsComputationTypeTableColumns = (
    opts?: IAccountsComputationTypeTableColumnProps
): ColumnDef<IAccountsComputationTypeResource>[] => {
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
            id: 'name',
            accessorKey: 'name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Name">
                    <ColumnActions {...props}>
                        <TextFilter<IAccountsComputationTypeResource>
                            displayText="Name"
                            field="name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { name },
                },
            }) => <div>{name}</div>,
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
                        <TextFilter<IAccountsComputationTypeResource>
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
            size: 200,
            minSize: 200,
            maxSize: 300,
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<IAccountsComputationTypeResource>
                            displayText="Date Created"
                            field="createdAt"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { createdAt },
                },
            }) => <div>{toReadableDate(createdAt)}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
        {
            id: 'createdBy',
            accessorKey: 'createdBy',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Created By" />
            ),
            cell: ({
                row: {
                    original: { createdBy },
                },
            }) => <div>{createdBy}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 180,
            minSize: 180,
        },
        {
            id: 'updatedAt',
            accessorKey: 'updatedAt',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Last Updated">
                    <ColumnActions {...props}>
                        <DateFilter<IAccountsComputationTypeResource>
                            displayText="Last Updated"
                            field="updatedAt"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { updatedAt },
                },
            }) => <div>{updatedAt ? toReadableDate(updatedAt) : ''}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 180,
            minSize: 180,
        },
        {
            id: 'updatedBy',
            accessorKey: 'updatedBy',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Updated By" />
            ),
            cell: ({
                row: {
                    original: { updatedBy },
                },
            }) => <div>{updatedBy}</div>,
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 180,
            minSize: 180,
        },
    ]
}

export default AccountsComputationTypeTableColumns
