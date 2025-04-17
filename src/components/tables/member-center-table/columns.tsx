import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'
import { IMemberCenterResource } from '@/server/types'

export const memberCenterGlobalSearchTargets: IGlobalSearchTargets<IMemberCenterResource>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'description', displayText: 'Description' },
    ]

export interface IMemberCenterTableActionComponentProp {
    row: Row<IMemberCenterResource>
}

export interface IMemberCenterTableColumnProps {
    actionComponent?: (
        props: IMemberCenterTableActionComponentProp
    ) => ReactNode
}

const memberCenterTableColumns = (
    opts?: IMemberCenterTableColumnProps
): ColumnDef<IMemberCenterResource>[] => {
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
                        <TextFilter<IMemberCenterResource>
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
            size: 120,
            minSize: 120,
            maxSize: 250,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberCenterResource>
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
            minSize: 200,
            size: 300,
            maxSize: 500,
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<IMemberCenterResource>
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
            enableResizing: true,
            minSize: 150,
        },
    ]
}

export default memberCenterTableColumns
