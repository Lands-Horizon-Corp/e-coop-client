import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import { PushPinSlashIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { IMemberTypeReference } from '@/types'

export const memberTypeReferenceGlobalSearchTargets: IGlobalSearchTargets<IMemberTypeReference>[] =
    [{ field: 'description', displayText: 'Description' }]

export interface IMemberTypeReferencesTableActionComponentProp {
    row: Row<IMemberTypeReference>
}

export interface IMemberTypeReferenceTableColumnProps {
    actionComponent?: (
        props: IMemberTypeReferencesTableActionComponentProp
    ) => ReactNode
}

const memberTypeReferenceTableColumns = (
    opts?: IMemberTypeReferenceTableColumnProps
): ColumnDef<IMemberTypeReference>[] => {
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
                        <TextFilter<IMemberTypeReference>
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
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 180,
        },
        {
            id: 'interestRate',
            accessorKey: 'interestRate',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Interest Rate">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberTypeReference>
                            displayText="Interest Rate"
                            field="interestRate"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { interestRate },
                },
            }) => <div>{interestRate} %</div>,
            enableMultiSort: true,
            enableResizing: true,
            size: 180,
            minSize: 180,
        },
        {
            id: 'minimumBalance',
            accessorKey: 'minimumBalance',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Minimum Balance">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberTypeReference>
                            displayText="Minimum Balance"
                            field="minimumBalance"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { minimumBalance },
                },
            }) => <div>{minimumBalance}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 200,
            maxSize: 500,
        },
        {
            id: 'activeMemberGroup',
            header: (props) => (
                <DataTableColumnHeader
                    {...props}
                    disableSort
                    title="Active Member"
                    containerClassName="justify-center"
                />
            ),
            columns: [
                {
                    id: 'activeMemberMinimumBalance',
                    accessorKey: 'activeMemberMinimumBalance',
                    header: (props) => (
                        <DataTableColumnHeader {...props} title="Min. Balance">
                            <ColumnActions {...props}>
                                <TextFilter<IMemberTypeReference>
                                    displayText="Active Minimum Balance"
                                    field="activeMemberMinimumBalance"
                                />
                            </ColumnActions>
                        </DataTableColumnHeader>
                    ),
                    cell: ({
                        row: {
                            original: { activeMemberMinimumBalance },
                        },
                    }) => <div>{activeMemberMinimumBalance}</div>,
                },
                {
                    id: 'activeMemberRatio',
                    accessorKey: 'activeMemberRatio',
                    header: (props) => (
                        <DataTableColumnHeader {...props} title="Ratio">
                            <ColumnActions {...props}>
                                <TextFilter<IMemberTypeReference>
                                    displayText="Ratio"
                                    field="Ratio"
                                />
                            </ColumnActions>
                        </DataTableColumnHeader>
                    ),
                    cell: ({
                        row: {
                            original: { activeMemberRatio },
                        },
                    }) => <div>{activeMemberRatio}</div>,
                },
            ],
            enablePinning: false,
            enableSorting: false,
            enableResizing: false,
        },
    ]
}

export default memberTypeReferenceTableColumns
