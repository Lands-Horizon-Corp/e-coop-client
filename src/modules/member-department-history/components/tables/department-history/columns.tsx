import { ReactNode } from 'react'

import { IMemberDepartmentHistory } from '@/modules/member-department-history/member-department-history.types'
import { ColumnDef } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import { RenderIcon, TIcon } from '@/components/icons'

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
                            displayText="Department"
                            field="member_department.name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full border bg-muted">
                        <RenderIcon
                            className="size-4"
                            icon={row.original.member_department?.icon as TIcon}
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
                            displayText="Description"
                            field="member_department.description"
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
