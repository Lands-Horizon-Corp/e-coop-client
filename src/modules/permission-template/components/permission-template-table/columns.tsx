import { ReactNode } from 'react'

import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon, ShieldExclamationIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'
import { IPermissionTemplate } from '../../permission-template.types'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'


export const permissionTemplateGlobalSearchTargets: IGlobalSearchTargets<IPermissionTemplate>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'permissions', displayText: 'Permissions' },
    ]

export interface IPermissionTemplateTableActionComponentProp {
    row: Row<IPermissionTemplate>
}

export interface IPermissionTemplateTableColumnProps {
    actionComponent?: (
        props: IPermissionTemplateTableActionComponentProp
    ) => ReactNode
}

const PermissionTemplateTableColumns = (
    opts?: IPermissionTemplateTableColumnProps
): ColumnDef<IPermissionTemplate>[] => {
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
                <DataTableColumnHeader
                    {...props}
                    title="Permission Template Name"
                >
                    <ColumnActions {...props}>
                        <TextFilter<IPermissionTemplate>
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
                        <TextFilter<IPermissionTemplate>
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
            }) => (
                <p className="!text-wrap text-muted-foreground">
                    {description}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 300,
            minSize: 300,
            maxSize: 800,
        },
        {
            id: 'permissions',
            accessorKey: 'permissions',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Permissions" />
            ),
            cell: ({
                row: {
                    original: { permissions },
                },
            }) => (
                <div className="flex flex-wrap gap-1">
                    <span className="border bg-yellow-400/20 rounded-xl px-2 py-0.5 text-xs">
                        <ShieldExclamationIcon className="inline text-amber-600" />{' '}
                        {permissions.length} Permissions
                    </span>
                </div>
            ),
            enableMultiSort: true,
            enableSorting: false,
            enableResizing: false,
            enableHiding: false,
            size: 160,
            minSize: 160,
            maxSize: 400,
        },
        ...createUpdateColumns<IPermissionTemplate>(),
    ]
}

export default PermissionTemplateTableColumns
