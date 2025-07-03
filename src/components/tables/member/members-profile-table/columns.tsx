import { ReactNode } from 'react'

import { CIVIL_STATUS, GENERAL_STATUS } from '@/constants'
import { useInfoModalStore } from '@/store/info-modal-store'
import { ColumnDef, Row } from '@tanstack/react-table'

import CivilStatusBadge from '@/components/badges/civil-status-badge'
import GeneralStatusBadge from '@/components/badges/general-status-badge'
import YesNoBadge from '@/components/badges/yes-no-badge'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
// import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import { PushPinSlashIcon, QrCodeIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { QrCodeDownloadable } from '@/components/qr-code'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CopyWrapper } from '@/components/wrappers/copy-wrapper'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IMemberProfile, TCivilStatus, TGeneralStatus } from '@/types'

import { createUpdateColumns } from '../../common-columns'

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
                    <PreviewMediaWrapper media={media}>
                        <ImageDisplay
                            src={media?.download_url}
                            className="mx-auto size-7"
                        />
                    </PreviewMediaWrapper>
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
            }) => (
                <div onClick={(e) => e.stopPropagation()} className="uppercase">
                    <CopyWrapper>
                        <p className="rounded-lg bg-popover px-2 py-1 text-primary/70">
                            {passbook}
                        </p>
                    </CopyWrapper>
                </div>
            ),
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
            }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    {contact_number && (
                        <CopyWrapper>{contact_number}</CopyWrapper>
                    )}
                </div>
            ),
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
            id: 'member_type',
            accessorKey: 'member_type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member Type">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="member_type.name"
                            displayText="Member Type"
                            defaultMode="equal"
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
            size: 200,
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
                            field="status"
                            dataType="text"
                            mode="contains"
                            defaultMode="equal"
                            displayText="Status"
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
            size: 200,
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
                            field="civil_status"
                            dataType="text"
                            mode="contains"
                            defaultMode="equal"
                            displayText="Civil Status"
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
            size: 200,
            minSize: 150,
        },
        {
            id: 'member_group',
            accessorKey: 'member_group',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member Group">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="member_group.name"
                            displayText="Member Group"
                            defaultMode="equal"
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
            size: 200,
            minSize: 150,
        },
        {
            id: 'member_center',
            accessorKey: 'member_center',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member Center">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="member_center.name"
                            displayText="Member Center"
                            defaultMode="equal"
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
            size: 200,
            minSize: 150,
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
                            field="is_micro_finance_member"
                            dataType="boolean"
                            mode="contains"
                            defaultMode="equal"
                            displayText="Micro Finance Member"
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
                            field="is_mutual_fund_member"
                            dataType="boolean"
                            mode="contains"
                            defaultMode="equal"
                            displayText="Mutual Fund Member"
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
            size="sm"
            variant="secondary"
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
        >
            <QrCodeIcon className="size-4" />
        </Button>
    )
}

export default MemberProfileTableColumns
