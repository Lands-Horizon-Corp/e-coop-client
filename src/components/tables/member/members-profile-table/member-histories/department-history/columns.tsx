import { ReactNode } from 'react'

import { ColumnDef } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import { RenderIcon } from '@/components/icons'
import { createUpdateColumns } from '@/components/tables/common-columns'

import { IMemberDepartmentHistory, TIcon } from '@/types'

export interface IMemberDepartmentHistoryColumnProps {
    actionComponent?: (props: { row: IMemberDepartmentHistory }) => ReactNode
}

export const memberDepartmentHistoryGlobalSearchTargets: IGlobalSearchTargets<IMemberDepartmentHistory>[] =
    [
        { field: 'member_department.name', displayText: 'Department Name' },
        { field: 'member_department.description', displayText: 'Description' },
    ]

const memberDepartmentHistoryColumns =
    (): ColumnDef<IMemberDepartmentHistory>[] => [
        {
            id: 'department',
            accessorKey: 'member_department.name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Department">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="contains"
                            field="member_department.name"
                            displayText="Department"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full border bg-muted">
                        <RenderIcon
                            icon={row.original.member_department?.icon as TIcon}
                            className="size-4"
                        />
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate font-semibold">
                            {row.original.member_department?.name || '-'}
                        </span>
                        <span className="truncate text-xs text-muted-foreground/70">
                            {row.original.member_department?.description || '-'}
                        </span>
                    </div>
                </div>
            ),
            enableSorting: true,
            enableResizing: false,
            minSize: 200,
        },
        {
            id: 'description',
            accessorKey: 'member_department.description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberDepartmentHistory>
                            defaultMode="contains"
                            field="member_department.description"
                            displayText="Description"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div>{row.original.member_department?.description || '-'}</div>
            ),
            enableSorting: true,
            enableResizing: false,
        },
        ...createUpdateColumns<IMemberDepartmentHistory>(),
    ]

export default memberDepartmentHistoryColumns
