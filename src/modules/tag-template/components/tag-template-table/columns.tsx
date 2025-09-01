import { ReactNode } from 'react'

import { TagTemplateCategoryBadge } from '@/modules/tag-template/components/tag-template-category-badge'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { IconMap, PushPinSlashIcon, TIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'

import { ITagTemplate } from '../../tag-template.types'

export const tagTemplateGlobalSearchTargets: IGlobalSearchTargets<ITagTemplate>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'category', displayText: 'Category' },
    ]

export interface ITagTemplateTableActionComponentProp {
    row: Row<ITagTemplate>
}

export interface ITagTemplateTableColumnProps {
    actionComponent?: (props: ITagTemplateTableActionComponentProp) => ReactNode
}

const TagTemplateTableColumns = (
    opts?: ITagTemplateTableColumnProps
): ColumnDef<ITagTemplate>[] => [
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
                    <TextFilter<ITagTemplate> displayText="Name" field="name" />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { name, description },
            },
        }) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-semibold">{name || '-'}</span>
                <span className="truncate text-xs text-muted-foreground/70">
                    {description || '-'}
                </span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 200,
        minSize: 180,
    },
    {
        id: 'category',
        accessorKey: 'category',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Category">
                <ColumnActions {...props}>
                    <TextFilter<ITagTemplate>
                        displayText="Category"
                        field="category"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { category },
            },
        }) => (
            <div>
                {category && (
                    <TagTemplateCategoryBadge
                        showIcon
                        size="sm"
                        tagCategory={category}
                    />
                )}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 200,
        minSize: 200,
    },
    {
        id: 'color',
        accessorKey: 'color',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Color">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { color },
            },
        }) => (
            <div className="flex items-center">
                <span
                    className="inline-block size-4 rounded-full border"
                    style={{ backgroundColor: color || '#ccc' }}
                />
                <span className="ml-2 text-xs">{color || '-'}</span>
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 150,
        minSize: 100,
    },
    {
        id: 'icon',
        accessorKey: 'icon',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Icon">
                <ColumnActions {...props} />
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { icon },
            },
        }) => {
            const Icon = IconMap[icon as TIcon]

            return <div>{Icon ? <Icon /> : ''}</div>
        },
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 100,
        minSize: 100,
    },

    ...createUpdateColumns<ITagTemplate>(),
]

export default TagTemplateTableColumns
