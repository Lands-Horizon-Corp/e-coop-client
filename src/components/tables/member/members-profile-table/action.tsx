import { FC, useState } from 'react'
import { useRouter } from '@tanstack/react-router'

import { IMemberProfileTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
// import { MemberCreateUpdateFormModal } from '@/components/forms/member-forms/member-create-update-form'
// import { MemberProfileCreateUpdateFormModal } from '@/components/forms/member-forms/member-application-form/member-profile-create-update-form'

import { MemberHistoriesModal } from '@/components/member-infos/member-histories'
import { MemberOverallInfoModal } from '@/components/member-infos/view-member-info'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { EyeIcon, UserClockFillIcon } from '@/components/icons'

interface IMemberProfileTableActionProps
    extends IMemberProfileTableActionComponentProp {
    onMemberUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberProfileTableAction: FC<IMemberProfileTableActionProps> = ({
    row,
}) => {
    const member = row.original
    const router = useRouter()
    // const [editModal, setEditModal] = useState(false)
    const [viewOverallInfo, setViewOverallInfo] = useState(false)
    const [viewHistoryModal, setViewHistoryModal] = useState(false)
    // const [editAccountModal, setEditAccountModal] = useState(false)

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                {member && (
                    <>
                        <MemberHistoriesModal
                            open={viewHistoryModal}
                            memberHistoryProps={{
                                profileId: member.id,
                            }}
                            onOpenChange={setViewHistoryModal}
                        />
                        <MemberOverallInfoModal
                            overallInfoProps={{
                                memberProfileId: member.id,
                            }}
                            open={viewOverallInfo}
                            onOpenChange={setViewOverallInfo}
                        />
                    </>
                )}
            </div>
            <RowActionsGroup
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick() {
                        router.navigate({
                            to: `../member-profile/${member.id}/personal-info`,
                        })
                    },
                }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() => setViewOverallInfo(true)}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Member&apos;s Info
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
                }
            />
        </>
    )
}

export default MemberProfileTableAction
