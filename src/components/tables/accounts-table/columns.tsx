import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'
import { IAccountsResource } from '@/server/types/accounts/accounts'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'

export const accountsGlobalSearchTargets: IGlobalSearchTargets<IAccountsResource>[] =
    [
        { field: 'accountCode', displayText: 'Account Code' },
        { field: 'description', displayText: 'Description' },
        { field: 'altDescription', displayText: 'Alternative Description' },
        { field: 'type', displayText: 'Account Type' },
        { field: 'maxAmount', displayText: 'Max Amount' },
        { field: 'minAmount', displayText: 'Min Amount' },
        { field: 'computationType', displayText: 'Computation Type' },
        {
            field: 'earnedUnearnedInterest',
            displayText: 'Earned/Unearned Interest',
        },
        {
            field: 'otherInformationOfAnAccount',
            displayText: 'Other Information',
        },
    ]

export interface IAccountsTableActionComponentProp {
    row: Row<IAccountsResource>
}

export interface IAccountsTableColumnProps {
    actionComponent?: (props: IAccountsTableActionComponentProp) => ReactNode
}

const AccountsTableColumns = (
    opts?: IAccountsTableColumnProps
): ColumnDef<IAccountsResource>[] => {
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
            id: 'accountCode',
            accessorKey: 'accountCode',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Account Code">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="accountCode"
                            displayText="Account Code"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { accountCode },
                },
            }) => <div>{accountCode}</div>,
            enableMultiSort: true,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="description"
                            displayText="Description"
                            defaultMode="contains"
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
        },
        {
            id: 'altDescription',
            accessorKey: 'altDescription',
            header: (props) => (
                <DataTableColumnHeader
                    {...props}
                    title="Alternative Description"
                >
                    <ColumnActions {...props}>
                        <TextFilter
                            field="altDescription"
                            displayText="Alternative Description"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { altDescription },
                },
            }) => <div>{altDescription}</div>,
            enableMultiSort: true,
        },
        {
            id: 'type',
            accessorKey: 'type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Account Type">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { type },
                },
            }) => <div>{type}</div>,
            enableSorting: true,
        },
        {
            id: 'maxAmount',
            accessorKey: 'maxAmount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Max Amount">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="maxAmount"
                            displayText="Max Amount"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { maxAmount },
                },
            }) => <div>{maxAmount}</div>,
            enableSorting: true,
        },
        {
            id: 'minAmount',
            accessorKey: 'minAmount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Min Amount">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="minAmount"
                            displayText="Min Amount"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { minAmount },
                },
            }) => <div>{minAmount}</div>,
            enableSorting: true,
        },
        {
            id: 'computationType',
            accessorKey: 'computationType',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Computation Type">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { computationType },
                },
            }) => <div>{computationType}</div>,
            enableSorting: true,
        },
        {
            id: 'earnedUnearnedInterest',
            accessorKey: 'earnedUnearnedInterest',
            header: (props) => (
                <DataTableColumnHeader
                    {...props}
                    title="Earned/Unearned Interest"
                >
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { earnedUnearnedInterest },
                },
            }) => <div>{earnedUnearnedInterest}</div>,
            enableSorting: true,
        },
        {
            id: 'otherInformationOfAnAccount',
            accessorKey: 'otherInformationOfAnAccount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Other Information">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { otherInformationOfAnAccount },
                },
            }) => <div>{otherInformationOfAnAccount}</div>,
            enableSorting: true,
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<IAccountsResource>
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
        },
    ]
}

export default AccountsTableColumns
