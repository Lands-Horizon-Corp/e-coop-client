import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon, RenderIcon, TIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { IMemberDepartment } from '../../member-department.types'

export const memberDepartmentGlobalSearchTargets: IGlobalSearchTargets<IMemberDepartment>[] =
    [
        { field: 'name', displayText: 'Department Name' },
        { field: 'description', displayText: 'Description' },
    ]

export interface IMemberDepartmentTableActionComponentProp {
    row: Row<IMemberDepartment>
}

export interface IMemberDepartmentTableColumnProps {
    actionComponent?: (
        props: IMemberDepartmentTableActionComponentProp
    ) => React.ReactNode
}

const MemberDepartmentTableColumns = (
    opts?: IMemberDepartmentTableColumnProps
): ColumnDef<IMemberDepartment>[] => [
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
            <DataTableColumnHeader {...props} title="Department">
                <ColumnActions {...props}>
                    <TextFilter<IMemberDepartment>
                        displayText="Department Name"
                        field="name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { name, icon, description },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-3">
                {icon && (
                    <div className="flex p-1 text-muted-foreground items-center justify-center rounded-full border bg-muted">
                        <RenderIcon icon={icon as TIcon} className="size-4" />
                    </div>
                )}
                <div className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold">
                        {name || (
                            <span className="text-muted-foreground/70 text-xs italic">
                                no name
                            </span>
                        )}
                    </span>
                    <span className="truncate text-xs text-muted-foreground/70">
                        {description || ''}
                    </span>
                </div>
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
        id: 'description',
        accessorKey: 'description',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Description">
                <ColumnActions {...props}>
                    <TextFilter<IMemberDepartment>
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
        }) => <div className="!text-wrap">{description || '-'}</div>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 180,
    },

    ...createUpdateColumns<IMemberDepartment>(),
]

export default MemberDepartmentTableColumns
