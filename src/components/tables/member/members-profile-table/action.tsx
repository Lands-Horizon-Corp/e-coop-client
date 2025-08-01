import { FC } from 'react'

import { useInfoModalStore } from '@/store/info-modal-store'
import { useRouter } from '@tanstack/react-router'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberProfileCloseFormModal } from '@/components/forms/member-forms/member-profile-close-form'
// import { MemberCreateUpdateFormModal } from '@/components/forms/member-forms/member-create-update-form'
// import { MemberProfileCreateUpdateFormModal } from '@/components/forms/member-forms/member-application-form/member-profile-create-update-form'
import {
    EyeIcon,
    HeartBreakFillIcon,
    QrCodeIcon,
    UserClockFillIcon,
} from '@/components/icons'
import { MemberHistoriesModal } from '@/components/member-infos/member-histories'
import { MemberOverallInfoModal } from '@/components/member-infos/view-member-info'
import { QrCodeDownloadable } from '@/components/qr-code'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useDeleteMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'
import { useModalState } from '@/hooks/use-modal-state'

import { IMemberProfileTableActionComponentProp } from './columns'

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
    const { onOpen } = useInfoModalStore()

    const infoModal = useModalState(false)
    const closeModal = useModalState(false)
    const historyModal = useModalState(false)

    const { mutate: deleteProfile, isPending: isDeleting } =
        useDeleteMemberProfile()

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                {member && (
                    <>
                        <MemberHistoriesModal
                            {...historyModal}
                            memberHistoryProps={{
                                profileId: member.id,
                            }}
                        />
                        <MemberOverallInfoModal
                            {...infoModal}
                            overallInfoProps={{
                                memberProfileId: member.id,
                            }}
                        />
                        <MemberProfileCloseFormModal
                            {...closeModal}
                            formProps={{
                                profileId: member.id,
                                defaultValues: {
                                    remarks: member.member_close_remarks ?? [],
                                },
                            }}
                        />
                    </>
                )}
            </div>
            <RowActionsGroup
                canDelete={!isDeleting}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick() {
                        router.navigate({
                            to: `../member-profile/${member.id}/personal-info`,
                        })
                    },
                }}
                onDelete={{
                    text: 'Delete',
                    isAllowed: true,
                    onClick: () => deleteProfile(member.id),
                }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() => infoModal.onOpenChange(true)}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Member&apos;s Info
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => historyModal.onOpenChange(true)}
                        >
                            <UserClockFillIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Member History
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                onOpen({
                                    title: 'Member Profile QR',
                                    description:
                                        'Share this member profile QR Code.',
                                    classNames: {
                                        className: 'w-fit',
                                    },
                                    hideConfirm: true,
                                    component: (
                                        <div className="space-y-2">
                                            <QrCodeDownloadable
                                                className="size-80 p-3"
                                                containerClassName="mx-auto"
                                                fileName={`member_profile_${member.passbook}`}
                                                value={JSON.stringify(
                                                    member.qr_code
                                                )}
                                            />
                                        </div>
                                    ),
                                })
                            }
                        >
                            <QrCodeIcon className="mr-2" />
                            Member Profile QR
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => infoModal.onOpenChange(true)}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Member&apos;s Info
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="focus:bg-destructive focus:text-destructive-foreground"
                            onClick={() => closeModal.onOpenChange(true)}
                        >
                            <HeartBreakFillIcon
                                className="mr-2 text-rose-500 duration-200 group-focus:text-destructive-foreground"
                                strokeWidth={1.5}
                            />
                            Close Profile/Account
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

export default MemberProfileTableAction
