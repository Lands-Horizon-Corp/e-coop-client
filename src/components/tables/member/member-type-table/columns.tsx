import { ReactNode } from 'react'

import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { IMemberType } from '@/types'

import { createUpdateColumns } from '../../common-columns'

export const memberTypeGlobalSearchTargets: IGlobalSearchTargets<IMemberType>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'prefix', displayText: 'Prefix' },
    ]

export interface IMemberTypeTableActionComponentProp {
    row: Row<IMemberType>
}

export interface IMemberTypeTableColumnProps {
    actionComponent?: (props: IMemberTypeTableActionComponentProp) => ReactNode
}

const memberTypeTableColumns = (
    opts?: IMemberTypeTableColumnProps
): ColumnDef<IMemberType>[] => {
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
                        <TextFilter<IMemberType>
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
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
        {
            id: 'prefix',
            accessorKey: 'prefix',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Prefix">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberType>
                            displayText="Prefix"
                            field="prefix"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { prefix },
                },
            }) => <Badge variant="secondary">{prefix}</Badge>,
            enableMultiSort: true,
            enableResizing: true,
            maxSize: 100,
            minSize: 100,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberType>
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
            enableResizing: true,
            minSize: 300,
            maxSize: 500,
        },
        ...createUpdateColumns<IMemberType>(),
    ]
}

export default memberTypeTableColumns
