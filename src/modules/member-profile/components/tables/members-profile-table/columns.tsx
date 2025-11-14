import { ReactNode } from 'react'

import { CIVIL_STATUS, GENERAL_STATUS } from '@/constants'
import GeneralStatusBadge from '@/modules/authentication/components/general-status-badge'
import CivilStatusBadge from '@/modules/member-profile/components/badges/civil-status-badge'
import { useInfoModalStore } from '@/store/info-modal-store'
import { ColumnDef, Row } from '@tanstack/react-table'

import YesNoBadge from '@/components/badges/yes-no-badge'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { createUpdateColumns } from '@/components/data-table/data-table-common-columns'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/data-table-multi-select-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import { PushPinSlashIcon, QrCodeIcon } from '@/components/icons'
import ImageNameDisplay from '@/components/image-name-display'
import { QrCodeDownloadable } from '@/components/qr-code'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { TCivilStatus, TGeneralStatus } from '@/types'

import { IMemberProfile } from '../../..'

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
                        aria-label="Select all"
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                'indeterminate')
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                    />
                    {!column.getIsPinned() && (
                        <PushPinSlashIcon
                            className="mr-2 size-3.5 cursor-pointer"
                            onClick={() => column.pin('left')}
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
            id: 'full_name',
            accessorKey: 'full_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Full Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="contains"
                            displayText="Full Name"
                            field="full_name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { full_name, media },
                },
            }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <ImageNameDisplay
                        className="mx-auto"
                        name={full_name}
                        src={media?.download_url}
                    />
                </div>
            ),
            enableMultiSort: true,
            enableResizing: true,
            minSize: 250,
        },
        {
            id: 'first_name',
            accessorKey: 'first_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="First Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="contains"
                            displayText="First Name"
                            field="first_name"
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
                            defaultMode="contains"
                            displayText="Middle Name"
                            field="middle_name"
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
                            defaultMode="contains"
                            displayText="Last Name"
                            field="last_name"
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
                            defaultMode="equal"
                            displayText="Suffix"
                            field="suffix"
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
            size: 110,
            minSize: 110,
        },
        {
            id: 'passbook',
            accessorKey: 'passbook',
            header: (props) => (
                <DataTableColumnHeader {...props} title="PB">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="equal"
                            displayText="Passbook"
                            field="passbook"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { passbook },
                },
            }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    {passbook ? (
                        <CopyWrapper>
                            <span className="rounded-lg bg-popover px-2 py-1 text-primary/70">
                                {passbook}
                            </span>
                        </CopyWrapper>
                    ) : (
                        <span className="text-xs text-muted-foreground/70 italic">
                            no passbook
                        </span>
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableResizing: true,
            minSize: 200,
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
            }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    {contact_number && (
                        <CopyWrapper>
                            <span>{contact_number}</span>
                        </CopyWrapper>
                    )}
                </div>
            ),
            enableMultiSort: true,
            enableResizing: true,
            minSize: 200,
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
            size: 120,
            minSize: 120,
        },
        {
            id: 'member_type',
            accessorKey: 'member_type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member Type">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="equal"
                            displayText="Member Type"
                            field="member_type.name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { member_type },
                },
            }) => <span>{member_type?.name ?? ''}</span>,
            enableMultiSort: true,
            enableResizing: true,
            size: 150,
            minSize: 150,
        },

        {
            id: 'status',
            accessorKey: 'status',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Status">
                    <ColumnActions {...props}>
                        <DataTableMultiSelectFilter<
                            IMemberProfile,
                            TGeneralStatus
                        >
                            dataType="text"
                            defaultMode="equal"
                            displayText="Status"
                            field="status"
                            mode="contains"
                            multiSelectOptions={GENERAL_STATUS.map(
                                (status) => ({
                                    label: status,
                                    value: status,
                                })
                            )}
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { status },
                },
            }) => <GeneralStatusBadge generalStatus={status} />,
            enableMultiSort: true,
            enableResizing: true,
            size: 150,
            minSize: 150,
        },
        {
            id: 'civil_status',
            accessorKey: 'civil_status',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Civil Status">
                    <ColumnActions {...props}>
                        <DataTableMultiSelectFilter<
                            IMemberProfile,
                            TCivilStatus
                        >
                            dataType="text"
                            defaultMode="equal"
                            displayText="Civil Status"
                            field="civil_status"
                            mode="contains"
                            multiSelectOptions={CIVIL_STATUS.map((status) => ({
                                label: status,
                                value: status,
                            }))}
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { civil_status },
                },
            }) => <CivilStatusBadge civilStatus={civil_status} />,
            enableMultiSort: true,
            enableResizing: true,
            size: 150,
            minSize: 150,
        },
        {
            id: 'member_group',
            accessorKey: 'member_group',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member Group">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="equal"
                            displayText="Member Group"
                            field="member_group.name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { member_group },
                },
            }) => <span>{member_group?.name ?? ''}</span>,
            enableMultiSort: true,
            enableResizing: true,
            size: 180,
            minSize: 180,
        },
        {
            id: 'member_center',
            accessorKey: 'member_center',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member Center">
                    <ColumnActions {...props}>
                        <TextFilter
                            defaultMode="equal"
                            displayText="Member Center"
                            field="member_center.name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { member_center },
                },
            }) => <span>{member_center?.name ?? ''}</span>,
            enableMultiSort: true,
            enableResizing: true,
            size: 180,
            minSize: 180,
        },
        {
            id: 'QR',
            accessorKey: 'qr_code',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member Profile QR" />
            ),
            cell: ({ row: { original } }) => (
                <QrCodeCell memberProfile={original} />
            ),
            enableMultiSort: true,
            enableResizing: true,
            size: 200,
            minSize: 150,
        },

        {
            id: 'is_microfinance_member',
            accessorKey: 'is_micro_finance_member',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Micro Finance Member">
                    <ColumnActions {...props}>
                        <DataTableMultiSelectFilter<IMemberProfile, boolean>
                            dataType="boolean"
                            defaultMode="equal"
                            displayText="Micro Finance Member"
                            field="is_micro_finance_member"
                            mode="contains"
                            multiSelectOptions={[true, false].map((status) => ({
                                label: status ? 'yes' : 'no',
                                value: status,
                            }))}
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { is_micro_finance_member },
                },
            }) => <YesNoBadge value={is_micro_finance_member} />,
            enableMultiSort: true,
            enableResizing: true,
            size: 200,
            minSize: 150,
        },
        {
            id: 'is_mutual_fund_member',
            accessorKey: 'is_mutual_fund_member',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Mutual Fund Member">
                    <ColumnActions {...props}>
                        <DataTableMultiSelectFilter<IMemberProfile, boolean>
                            dataType="boolean"
                            defaultMode="equal"
                            displayText="Mutual Fund Member"
                            field="is_mutual_fund_member"
                            mode="contains"
                            multiSelectOptions={[true, false].map((status) => ({
                                label: status ? 'yes' : 'no',
                                value: status,
                            }))}
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { is_micro_finance_member },
                },
            }) => <YesNoBadge value={is_micro_finance_member} />,
            enableMultiSort: true,
            enableResizing: true,
            size: 200,
            minSize: 150,
        },
        ...createUpdateColumns<IMemberProfile>(),
    ]
}

export const QrCodeCell = ({
    memberProfile: { qr_code, passbook },
}: {
    memberProfile: IMemberProfile
}) => {
    const { onOpen } = useInfoModalStore()

    return (
        <Button
            className="h-auto p-1"
            onClick={(e) => {
                e.stopPropagation()
                onOpen({
                    title: 'Member Profile QR',
                    description: 'Share this member profile QR Code.',
                    classNames: {
                        className: 'w-fit',
                    },
                    hideConfirm: true,
                    component: (
                        <div className="space-y-2">
                            <QrCodeDownloadable
                                className="size-80 p-3"
                                containerClassName="mx-auto"
                                fileName={`member_profile_${passbook}`}
                                value={JSON.stringify(qr_code)}
                            />
                        </div>
                    ),
                })
            }}
            size="sm"
            variant="secondary"
        >
            <QrCodeIcon className="size-4" />
        </Button>
    )
}

export default MemberProfileTableColumns
