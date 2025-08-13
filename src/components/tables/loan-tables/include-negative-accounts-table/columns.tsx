import { ReactNode } from 'react'

import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import RawDescription from '@/components/raw-description'
import { createUpdateColumns } from '@/components/tables/common-columns'
import { Checkbox } from '@/components/ui/checkbox'

import { IIncludeNegativeAccount } from '@/types'

export const includeNegativeAccountGlobalSearchTargets: IGlobalSearchTargets<IIncludeNegativeAccount>[] =
    [
        { field: 'description', displayText: 'Description' },
        { field: 'account.name', displayText: 'Account' },
    ]

export interface IIncludeNegativeAccountTableActionComponentProp {
    row: Row<IIncludeNegativeAccount>
}

export interface IIncludeNegativeAccountTableColumnProps {
    actionComponent?: (
        props: IIncludeNegativeAccountTableActionComponentProp
    ) => ReactNode
}

const IncludeNegativeAccountColumns = (
    opts?: IIncludeNegativeAccountTableColumnProps
): ColumnDef<IIncludeNegativeAccount>[] => [
    {
        id: 'select',
        header: ({ table, column }) => (
            <div className="flex w-fit items-center gap-x-1 px-2">
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
    },
    {
        id: 'account',
        accessorKey: 'account.name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Account">
                <ColumnActions {...props}>
                    <TextFilter<IIncludeNegativeAccount>
                        displayText="Account"
                        field="account.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <div>{row.original.account.name}</div>,
        size: 250,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IIncludeNegativeAccount>
                        displayText="Description"
                        field="description"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <p className="text-muted-foreground">
                <RawDescription content={row.original.description ?? ''} />
            </p>
        ),
        size: 350,
    },
    ...createUpdateColumns<IIncludeNegativeAccount>(),
]

export default IncludeNegativeAccountColumns
