import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import {
    PushPinSlashIcon,
    BadgeQuestionIcon,
    BadgeCheckFillIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import UserAvatar from '@/components/user-avatar'
import { Checkbox } from '@/components/ui/checkbox'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'
import { IBranchResource, ICompanyResource } from '@/types/coop-types'

type RootType = IBranchResource

export const branchesGlobalSearchTargets: IGlobalSearchTargets<RootType>[] = [
    { field: 'name', displayText: 'Name' },
    { field: 'address', displayText: 'Address' },
    { field: 'contactNumber', displayText: 'Contact' },
    { field: 'isAdminVerified', displayText: 'Verify Status' },
]

export interface IBranchTableActionComponentProp {
    row: Row<IBranchResource>
}

export interface IBranchesTableColumnProps {
    actionComponent?: (props: IBranchTableActionComponentProp) => ReactNode
}

const branchesTableColumns = (
    opts?: IBranchesTableColumnProps
): ColumnDef<IBranchResource>[] => {
    return [
        {
            id: 'select',
            header: ({ table, column }) => (
                <div className={'flex w-fit items-center gap-x-1 px-2'}>
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
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
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            maxSize: 80,
        },
        {
            id: 'Name',
            accessorKey: 'name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Name">
                    <ColumnActions {...props}>
                        <TextFilter displayText="Name" field="name" />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { name },
                },
            }) => <div>{name}</div>,
            enableMultiSort: true,
        },
        {
            id: 'Logo',
            accessorKey: 'media',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Logo">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { media },
                },
            }) => (
                <div>
                    <UserAvatar src={media?.downloadURL ?? ''} />
                </div>
            ),
            enableSorting: false,
        },
        {
            id: 'address',
            accessorKey: 'address',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Address">
                    <ColumnActions {...props}>
                        <TextFilter displayText="Address" field="address" />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { address },
                },
            }) => <div>{address}</div>,
            enableMultiSort: true,
        },
        {
            id: 'Contact Number',
            accessorKey: 'contactNumber',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Contact Number">
                    <ColumnActions {...props}>
                        <TextFilter<ICompanyResource>
                            displayText="Contact"
                            field="contactNumber"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { contactNumber },
                },
            }) => <div>{contactNumber}</div>,
            enableMultiSort: true,
        },
        {
            id: 'Verify Status',
            accessorKey: 'isAdminVerified',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Verified">
                    <ColumnActions {...props}>
                        <DataTableMultiSelectFilter<ICompanyResource, boolean>
                            mode="equal"
                            dataType="boolean"
                            field="isAdminVerified"
                            displayText="Verify Status"
                            multiSelectOptions={[
                                {
                                    label: 'Verified',
                                    value: true,
                                },
                                {
                                    label: 'Not Verified',
                                    value: false,
                                },
                            ]}
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { isAdminVerified },
                },
            }) => (
                <div>
                    {isAdminVerified ? (
                        <Badge
                            className="flex w-fit items-center gap-x-1"
                            variant="success"
                        >
                            <BadgeCheckFillIcon className="inline" /> Verified
                        </Badge>
                    ) : (
                        <Badge
                            className="flex w-fit items-center gap-x-1"
                            variant="warning"
                        >
                            <BadgeQuestionIcon className="inline" /> Pending
                        </Badge>
                    )}
                </div>
            ),
            enableMultiSort: true,
        },
        {
            id: 'Created At',
            accessorKey: 'createdAt',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<ICompanyResource>
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
        },
    ]
}
export default branchesTableColumns
