import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { PushPinSlashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
// import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'
import { IMemberProfile } from '@/types'

export const memberGlobalSearchTargets: IGlobalSearchTargets<IMemberProfile>[] =
    [
        { field: 'first_name', displayText: 'Name' },
        { field: 'full_name', displayText: 'Full Name' },
        { field: 'contact_number', displayText: 'Contact' },
        { field: 'status', displayText: 'Verify Status' },
    ]

export interface IMemberProfileTableActionComponentProp {
    row: Row<IMemberProfile>
}

export interface IMemberProfilesTableColumnProps {
    actionComponent?: (
        props: IMemberProfileTableActionComponentProp
    ) => ReactNode
}

const MemberProfileTableColumns = (
    opts?: IMemberProfilesTableColumnProps
): ColumnDef<IMemberProfile>[] => {
    return [
        {
            id: 'select',
            header: ({ table, column }) => (
                <div className={'flex w-fit items-center gap-x-1 px-2'}>
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                'indeterminate')
                        }
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
            enableResizing: false,
            enableHiding: false,
            size: 80,
            minSize: 80,
        },
        {
            id: 'Media',
            accessorKey: 'media',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Picture">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { media },
                },
            }) => (
                <div className="mx-auto">
                    <ImageDisplay
                        src={media?.download_url}
                        className="mx-auto size-7"
                    />
                </div>
            ),
            enableSorting: false,
            enableResizing: false,
            enableHiding: false,
            maxSize: 100,
        },
        {
            id: 'first_name',
            accessorKey: 'first_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="First Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="first_name"
                            displayText="First Name"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { first_name },
                },
            }) => <div onClick={(e) => e.stopPropagation()}>{first_name}</div>,
            enableMultiSort: true,
            enableResizing: true,
            size: 100,
            minSize: 150,
        },
        {
            id: 'middle_name',
            accessorKey: 'middle_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Middle Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="middle_name"
                            displayText="Middle Name"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { middle_name },
                },
            }) => <div onClick={(e) => e.stopPropagation()}>{middle_name}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'last_name',
            accessorKey: 'last_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Last Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="last_name"
                            displayText="Last Name"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { last_name },
                },
            }) => <div onClick={(e) => e.stopPropagation()}>{last_name}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'suffix',
            accessorKey: 'suffix',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Suffix">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="suffix"
                            displayText="Suffix"
                            defaultMode="equal"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { suffix },
                },
            }) => <div onClick={(e) => e.stopPropagation()}>{suffix}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'passbook',
            accessorKey: 'passbook',
            header: (props) => (
                <DataTableColumnHeader {...props} title="PB">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="passbook"
                            displayText="Passbook"
                            defaultMode="equal"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { passbook },
                },
            }) => <div onClick={(e) => e.stopPropagation()}>{passbook}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'contact_number',
            accessorKey: 'contact_number',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Contact Number">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberProfile>
                            displayText="Contact"
                            field="contact_number"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { contact_number },
                },
            }) => <div>{contact_number}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'member_gender',
            accessorKey: 'member_gender',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Gender">
                    <ColumnActions {...props}>
                        <TextFilter<IMemberProfile>
                            displayText="Gender"
                            field="member_gender.name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { member_gender },
                },
            }) => <div>{member_gender?.name}</div>,
            enableMultiSort: true,
            enableResizing: true,
            size: 200,
            minSize: 150,
        },
        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<IMemberProfile>
                            displayText="Date Created"
                            field="created_at"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { created_at },
                },
            }) => <div>{toReadableDate(created_at)}</div>,
            enableMultiSort: true,
            enableResizing: false,
            minSize: 180,
        },
    ]
}

export default MemberProfileTableColumns
