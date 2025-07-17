import { ReactNode } from 'react'

import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { IconMap } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { ICollateral } from '@/types'

import { createUpdateColumns } from '../common-columns'

export const collateralGlobalSearchTargets = [
    { field: 'name', displayText: 'Name' },
    { field: 'description', displayText: 'Description' },
]

export interface ICollateralTableActionComponentProp {
    row: Row<ICollateral>
}

export interface ICollateralTableColumnProps {
    actionComponent?: (props: ICollateralTableActionComponentProp) => ReactNode
}

const CollateralTableColumns = (
    opts?: ICollateralTableColumnProps
): ColumnDef<ICollateral>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex w-fit items-center gap-x-1 px-2">
                <HeaderToggleSelect table={table} />
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
                    <TextFilter<ICollateral> displayText="Name" field="name" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-semibold">
                    {original.name || '-'}
                </span>
                <span className="truncate text-xs text-muted-foreground/70">
                    {original.description || '-'}
                </span>
            </div>
        ),
        enableSorting: true,
        size: 200,
    },
    {
        id: 'icon',
        accessorKey: 'icon',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Icon">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({ row: { original } }) => {
            const Icon = IconMap[original.icon as keyof typeof IconMap]
            return <div>{Icon ? <Icon /> : ''}</div>
        },
        enableSorting: true,
        size: 100,
    },
    ...createUpdateColumns<ICollateral>(),
]

export default CollateralTableColumns
