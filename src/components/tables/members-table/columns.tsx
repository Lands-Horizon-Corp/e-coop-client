import { ReactNode } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'

import {
    PushPinSlashIcon,
    BadgeQuestionIcon,
    BadgeCheckFillIcon,
    BadgeExclamationIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import ImageDisplay from '@/components/image-display'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'

import { toReadableDate } from '@/utils'
import { TAccountStatus, IMember } from '@/types'

export const memberGlobalSearchTargets: IGlobalSearchTargets<IMember>[] = [
    { field: 'name', displayText: 'Name' },
    { field: 'address', displayText: 'Address' },
    { field: 'Owner.username', displayText: 'Owner' },
    { field: 'contactNumber', displayText: 'Contact' },
    { field: 'isAdminVerified', displayText: 'Verify Status' },
]

export interface IMemberTableActionComponentProp {
    row: Row<IMember>
}

export interface IMembersTableColumnProps {
    actionComponent?: (props: IMemberTableActionComponentProp) => ReactNode
}

const membersTableColumns = (
    opts?: IMembersTableColumnProps
): ColumnDef<IMember>[] => {
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
                        src={media?.downloadURL}
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
            id: 'Firstname',
            accessorKey: 'firstName',
            header: (props) => (
                <DataTableColumnHeader {...props} title="First Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="firstName"
                            displayText="Firstname"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { firstName },
                },
            }) => <div onClick={(e) => e.stopPropagation()}>{firstName}</div>,
            enableMultiSort: true,
            enableResizing: true,
            size: 100,
            minSize: 150,
        },
        {
            id: 'middleName',
            accessorKey: 'middleName',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Middle Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="middleName"
                            displayText="Middle Name"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { middleName },
                },
            }) => <div onClick={(e) => e.stopPropagation()}>{middleName}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'lastName',
            accessorKey: 'lastName',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Last Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="lastName"
                            displayText="Last Name"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { lastName },
                },
            }) => <div onClick={(e) => e.stopPropagation()}>{lastName}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'Passbook',
            accessorKey: 'memberProfile.passbookNumber',
            header: (props) => (
                <DataTableColumnHeader {...props} title="PB">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="memberProfile.passbookNumber"
                            displayText="Passbook"
                            defaultMode="equal"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { memberProfile },
                },
            }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    {memberProfile?.passbookNumber}
                </div>
            ),
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'permanentAddress',
            accessorKey: 'permanentAddress',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Address">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="permanentAddress"
                            displayText="Address"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { permanentAddress },
                },
            }) => <div>{permanentAddress}</div>,
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'contactNumber',
            accessorKey: 'contactNumber',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Contact Number">
                    <ColumnActions {...props}>
                        <TextFilter<IMember>
                            displayText="Contact"
                            field="contactNumber"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { contactNumber, isContactVerified },
                },
            }) => (
                <div>
                    {isContactVerified ? (
                        <BadgeCheckFillIcon className="mr-1 inline text-primary" />
                    ) : (
                        <BadgeQuestionIcon className="mr-1 inline text-amber-400" />
                    )}
                    {contactNumber}
                </div>
            ),
            enableMultiSort: true,
            enableResizing: true,
            minSize: 150,
        },
        {
            id: 'email',
            accessorKey: 'email',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Email">
                    <ColumnActions {...props}>
                        <TextFilter<IMember>
                            displayText="Email"
                            field="email"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { email, isEmailVerified },
                },
            }) => (
                <div>
                    {isEmailVerified ? (
                        <BadgeCheckFillIcon className="mr-1 inline text-primary" />
                    ) : (
                        <BadgeQuestionIcon className="mr-1 inline text-amber-400" />
                    )}
                    {email}
                </div>
            ),
            enableMultiSort: true,
            enableResizing: true,
            size: 200,
            minSize: 150,
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Status">
                    <ColumnActions {...props}>
                        <DataTableMultiSelectFilter<IMember, TAccountStatus>
                            mode="equal"
                            field="status"
                            dataType="text"
                            displayText="Status"
                            multiSelectOptions={[
                                {
                                    label: 'Pending',
                                    value: 'Pending',
                                },
                                {
                                    label: 'Verified',
                                    value: 'Verified',
                                },
                                {
                                    label: 'Not Allowed',
                                    value: 'Not Allowed',
                                },
                            ]}
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { status },
                },
            }) => (
                <div>
                    {status === 'Verified' && (
                        <Badge
                            className="flex w-fit items-center gap-x-1 px-1.5"
                            variant="success"
                        >
                            <BadgeCheckFillIcon className="inline" /> Verified
                        </Badge>
                    )}
                    {status === 'Pending' && (
                        <Badge
                            className="flex w-fit items-center gap-x-1 px-1.5"
                            variant="warning"
                        >
                            <BadgeQuestionIcon className="inline" /> Pending
                        </Badge>
                    )}
                    {status === 'Not Allowed' && (
                        <Badge
                            className="flex w-fit items-center gap-x-1 px-1.5"
                            variant="destructive"
                        >
                            <BadgeExclamationIcon className="inline" /> Not
                            Allowed
                        </Badge>
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableResizing: false,
            minSize: 120,
        },
        {
            id: 'isEmailVerified',
            accessorKey: 'isEmailVerified',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Email Verified">
                    <ColumnActions {...props}>
                        <DataTableMultiSelectFilter<IMember, boolean>
                            mode="equal"
                            dataType="boolean"
                            field="isEmailVerified"
                            displayText="Email Verified"
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
                    original: { isEmailVerified },
                },
            }) => (
                <div>
                    {isEmailVerified ? (
                        <span className="text-green-400">Verified</span>
                    ) : (
                        <span className="text-amber-400">Pending</span>
                    )}
                </div>
            ),
            enableMultiSort: true,
        },
        {
            id: 'isContactVerified',
            accessorKey: 'isContactVerified',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Contact Verified">
                    <ColumnActions {...props}>
                        <DataTableMultiSelectFilter<IMember, boolean>
                            mode="equal"
                            dataType="boolean"
                            field="isContactVerified"
                            displayText="Contact Verified"
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
                    original: { isContactVerified },
                },
            }) => (
                <div>
                    {isContactVerified ? (
                        <span className="text-green-400">Verified</span>
                    ) : (
                        <span className="text-amber-400">Pending</span>
                    )}
                </div>
            ),
            enableMultiSort: true,
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<IMember>
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
            enableResizing: false,
            minSize: 180,
        },
    ]
}

export default membersTableColumns
