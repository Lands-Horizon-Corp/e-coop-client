import { ReactNode } from 'react'

import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { PushPinSlashIcon, RenderIcon } from '@/components/icons'
import { createUpdateColumns } from '@/components/tables/common-columns'
import { Checkbox } from '@/components/ui/checkbox'

import { ILoanPurpose, TIcon } from '@/types'

export const loanPurposeGlobalSearchTargets: IGlobalSearchTargets<ILoanPurpose>[] =
    [
        { field: 'description', displayText: 'Description' },
        { field: 'icon', displayText: 'Icon' },
    ]

export interface ILoanPurposeTableActionComponentProp {
    row: Row<ILoanPurpose>
}

export interface ILoanPurposeTableColumnProps {
    actionComponent?: (props: ILoanPurposeTableActionComponentProp) => ReactNode
}

const LoanPurposeTableColumns = (
    opts?: ILoanPurposeTableColumnProps
): ColumnDef<ILoanPurpose>[] => {
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
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanPurpose>
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
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 300,
            minSize: 180,
        },
        {
            id: 'icon',
            accessorKey: 'icon',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Icon">
                    <ColumnActions {...props}>
                        <TextFilter<ILoanPurpose>
                            displayText="Icon"
                            field="icon"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { icon },
                },
            }) => (
                <span>
                    <RenderIcon icon={icon as TIcon} />
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: false,
            enableHiding: false,
            size: 90,
            minSize: 90,
        },
        ...createUpdateColumns<ILoanPurpose>(),
    ]
}

export default LoanPurposeTableColumns
