import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'

import { IMemberTableActionComponentProp } from '../columns'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { EyeIcon, UserClockFillIcon, UserIcon } from '@/components/icons'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberCreateUpdateFormModal } from '@/components/forms/member-forms/member-create-update-form'
import { MemberProfileCreateUpdateFormModal } from '@/components/forms/member-forms/member-application-form/member-profile-create-update-form'

import { MemberHistoriesModal } from '@/components/member-histories'
import { MemberOverallInfoModal } from '@/components/member-infos/view-member-info'

interface IMembersTableEmployeeActionProps
    extends IMemberTableActionComponentProp {
    onMemberUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MembersTableEmployeeAction = ({
    row,
}: IMembersTableEmployeeActionProps) => {
    const member = row.original
    const router = useRouter()
    const [editModal, setEditModal] = useState(false)
    const [viewOverallInfo, setViewOverallInfo] = useState(false)
    const [viewHistoryModal, setViewHistoryModal] = useState(false)
    const [editAccountModal, setEditAccountModal] = useState(false)

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberProfileCreateUpdateFormModal
                    title="Update Member Profile"
                    description="Update member profile details"
                    open={editModal}
                    onOpenChange={setEditModal}
                    className="max-w-7xl"
                    formProps={{
                        defaultValues: member.memberProfile,
                        disabledFields: ['memberId'],
                        branchPickerCreateProps: {
                            disabledFields: ['companyId'],
                        },
                        memberGenderCreateProps: {},
                        memberCenterPickerCreateProps: {},
                        memberClassificationCreateProps: {},
                        memberOccupationComboboxCreateProps: {},
                        educationalAttainmentComboboxCreateProps: {},
                    }}
                />
                <MemberCreateUpdateFormModal
                    title="Update Member Account"
                    description="Update member account details."
                    open={editAccountModal}
                    onOpenChange={setEditAccountModal}
                    formProps={{
                        defaultValues: {
                            mode: 'update',
                            ...member,
                            birthDate: new Date(member.birthDate),
                        },
                    }}
                />
                {member.memberProfile && (
                    <>
                        <MemberHistoriesModal
                            open={viewHistoryModal}
                            memberHistoryProps={{
                                profileId: member.memberProfile?.id,
                            }}
                            onOpenChange={setViewHistoryModal}
                        />
                        <MemberOverallInfoModal
                            overallInfoProps={{
                                memberProfileId: member.memberProfile.id,
                            }}
                            open={viewOverallInfo}
                            onOpenChange={setViewOverallInfo}
                        />
                    </>
                )}
            </div>
            <RowActionsGroup
                onEdit={{
                    text: 'Edit Account',
                    isAllowed: true,
                    onClick: () => setEditAccountModal((prev) => !prev),
                }}
                otherActions={
                    <>
                        {!member.memberProfile ? (
                            <DropdownMenuItem
                                onClick={() => {
                                    router.navigate({
                                        to: `/owner/users/members/$memberId/member-application` as string,
                                        params: { memberId: member.id },
                                    })
                                }}
                            >
                                <UserIcon className="mr-2" />
                                Setup Profile
                            </DropdownMenuItem>
                        ) : (
                            <>
                                <DropdownMenuItem
                                    onClick={() => setViewOverallInfo(true)}
                                >
                                    <EyeIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    View Member&apos;s Info
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setEditModal((val) => !val)}
                                >
                                    <UserIcon className="mr-2" />
                                    Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setViewHistoryModal(true)}
                                >
                                    <UserClockFillIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    Member History
                                </DropdownMenuItem>
                            </>
                        )}
                    </>
                }
            />
        </>
    )
}

export default MembersTableEmployeeAction
