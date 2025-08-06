import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon, RenderIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Checkbox } from '@/components/ui/checkbox'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IDisbursement, TIcon } from '@/types'

import { createUpdateColumns } from '../common-columns'

export const disbursementGlobalSearchTargets: IGlobalSearchTargets<IDisbursement>[] =
    [
        { field: 'name', displayText: 'Disbursement Name' },
        { field: 'description', displayText: 'Description' },
    ]

export interface IDisbursementTableActionComponentProp {
    row: Row<IDisbursement>
}

export interface IDisbursementTableColumnProps {
    actionComponent?: (
        props: IDisbursementTableActionComponentProp
    ) => React.ReactNode
}

const DisbursementTableColumns = (
    opts?: IDisbursementTableColumnProps
): ColumnDef<IDisbursement>[] => [
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
            <DataTableColumnHeader {...props} title="Disbursement">
                <ColumnActions {...props}>
                    <TextFilter<IDisbursement>
                        displayText="Disbursement Name"
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
                    <RenderIcon
                        icon={icon as TIcon}
                        className="shrink-0 size-5 text-muted-foreground"
                    />
                )}
                <div className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold">
                        {name || '-'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground/70">
                        {description || '-'}
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
                    <TextFilter<IDisbursement>
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
    {
        id: 'organization',
        accessorKey: 'organization_id',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Organization">
                <ColumnActions {...props}>
                    <TextFilter<IDisbursement>
                        displayText="Organization"
                        field="organization.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { organization },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-2">
                {organization ? (
                    <>
                        <PreviewMediaWrapper media={organization.media}>
                            <ImageDisplay
                                src={organization.media?.download_url}
                                className="h-6 w-6 rounded-full border bg-muted object-cover"
                            />
                        </PreviewMediaWrapper>
                        <span className="truncate text-sm">
                            {organization.name}
                        </span>
                    </>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 160,
        minSize: 120,
    },
    {
        id: 'branch',
        accessorKey: 'branch_id',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Branch">
                <ColumnActions {...props}>
                    <TextFilter<IDisbursement>
                        displayText="Branch"
                        field="branch.name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { branch },
            },
        }) => (
            <div className="flex min-w-0 items-center gap-2">
                {branch ? (
                    <>
                        <PreviewMediaWrapper media={branch.media}>
                            <ImageDisplay
                                src={branch.media?.download_url}
                                className="h-6 w-6 rounded-full border bg-muted object-cover"
                            />
                        </PreviewMediaWrapper>
                        <span className="truncate text-sm">{branch.name}</span>
                    </>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </div>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: true,
        size: 160,
        minSize: 120,
    },

    ...createUpdateColumns<IDisbursement>(),
]

export default DisbursementTableColumns
