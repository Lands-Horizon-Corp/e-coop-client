import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { PushPinSlashIcon, RenderIcon } from '@/components/icons'
import { createUpdateColumns } from '@/components/tables/common-columns'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { ILoanStatus, TIcon } from '@/types'

export const loanStatusGlobalSearchTargets: IGlobalSearchTargets<ILoanStatus>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'description', displayText: 'Description' },
        { field: 'icon', displayText: 'Icon' },
    ]

export interface ILoanStatusTableActionComponentProp {
    row: Row<ILoanStatus>
}

export interface ILoanStatusTableColumnProps {
    actionComponent?: (props: ILoanStatusTableActionComponentProp) => ReactNode
}

const LoanStatusTableColumns = (
    opts?: ILoanStatusTableColumnProps
): ColumnDef<ILoanStatus>[] => {
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
                        <TextFilter<ILoanStatus>
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
            id: 'icon',
            accessorKey: 'icon',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Icon">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanStatus>
                            displayText="Icon"
                            field="icon"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { icon, color },
                },
            }) => (
                <span>
                    <RenderIcon icon={icon as TIcon} style={{ color }} />
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: false,
            enableHiding: false,
            size: 90,
            minSize: 90,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanStatus>
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
        ...createUpdateColumns<ILoanStatus>(),
    ]
}

export default LoanStatusTableColumns
