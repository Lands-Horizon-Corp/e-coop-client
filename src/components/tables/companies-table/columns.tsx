import { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ColumnDef, Row } from '@tanstack/react-table'

import {
    PushPinSlashIcon,
    BadgeQuestionIcon,
    BadgeCheckFillIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import ImageDisplay from '@/components/image-display'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'
import { ICompanyResource } from '@/server/types'

export const companyGlobalSearchTargets: IGlobalSearchTargets<ICompanyResource>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'address', displayText: 'Address' },
        { field: 'Owner.username', displayText: 'Owner' },
        { field: 'contactNumber', displayText: 'Contact' },
        { field: 'isAdminVerified', displayText: 'Verify Status' },
    ]

export interface ICompanyTableActionComponentProp {
    row: Row<ICompanyResource>
}

export interface ICompaniesTableColumnProps {
    actionComponent?: (props: ICompanyTableActionComponentProp) => ReactNode
}

const companiesTableColumns = (
    opts?: ICompaniesTableColumnProps
): ColumnDef<ICompanyResource>[] => {
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
                        <TextFilter
                            field="name"
                            displayText="Name"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { id, name },
                },
            }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Link
                        params={{ companyId: id }}
                        to="/admin/companies-management/$companyId/view"
                        className="hover:underline"
                    >
                        {name}
                    </Link>
                </div>
            ),
            enableMultiSort: true,
            minSize: 200,
            maxSize: 500,
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
                    <ImageDisplay src={media?.downloadURL} className="size-7" />
                </div>
            ),
            enableSorting: false,
            enableResizing: false,
            minSize: 100,
        },
        {
            id: 'address',
            accessorKey: 'address',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Address">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="address"
                            displayText="Address"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { address },
                },
            }) => (
                <div>
                    <p className="!whitespace-normal">{address} </p>
                </div>
            ),
            enableMultiSort: true,
            minSize: 200,
            maxSize: 500,
        },
        {
            id: 'branches',
            accessorKey: 'branches',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Branches">
                    <ColumnActions {...props}>
                        <NumberFilter
                            displayText="# Branches"
                            field="branches"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { branches },
                },
            }) => <div>{branches?.length ?? 0}</div>,
            enableSorting: false,
        },
        {
            id: 'Owner.username',
            accessorKey: 'owner.username',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Owner">
                    <ColumnActions {...props}>
                        <TextFilter<ICompanyResource>
                            displayText="Owner"
                            field="Owner.username"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { owner },
                },
            }) => (
                <div>
                    {owner?.username ?? (
                        <span className="text-center italic text-foreground/40">
                            -
                        </span>
                    )}
                </div>
            ),
            enableSorting: true,
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
            maxSize: 300,
            minSize: 200,
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
            minSize: 200,
            enableMultiSort: true,
        },
    ]
}

export default companiesTableColumns
