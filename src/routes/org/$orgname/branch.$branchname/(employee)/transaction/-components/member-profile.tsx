import { useState } from 'react'

import { useImagePreview } from '@/store/image-preview-store'

import CopyWrapper from '@/components/elements/copy-wrapper'
import HoveruserInfo from '@/components/elements/hover-elements/hover-user-info'
import ImageNameDisplay from '@/components/elements/image-name-display'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    BadgeCheckIcon,
    IdCardIcon,
    PhoneIcon,
    SignatureLightIcon,
    UserIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { MemberOverallInfoModal } from '@/components/member-infos/view-member-info'
import { Button } from '@/components/ui/button'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IMedia, IMemberProfile } from '@/types'

import JointMemberProfileListModal from './joint-member-profile-list-modal'

type MemberProfileTransactionViewProps = {
    memberInfo: IMemberProfile
}

const MemberProfileTransactionView = ({
    memberInfo,
}: MemberProfileTransactionViewProps) => {
    const [openJointList, setOpenJointList] = useState(false)
    const infoModal = useModalState(false)
    const { onOpen } = useImagePreview()

    return (
        <div className="w-full space-y-2 rounded-xl dark:bg-sidebar/20">
            <MemberOverallInfoModal
                {...infoModal}
                overallInfoProps={{
                    memberProfileId: memberInfo.id,
                }}
            />
            {memberInfo?.member_joint_accounts && (
                <JointMemberProfileListModal
                    onOpenChange={setOpenJointList}
                    open={openJointList}
                    jointAccounts={memberInfo?.member_joint_accounts}
                />
            )}
            <GradientBackground
                gradientOnly
                opacity={0}
                className="flex w-full  justify-between space-x-5 border-[0.5px]  overflow-y-auto overflow-auto bg-sidebar/20 p-5"
            >
                <div className="flex items-center gap-y-2 flex-col">
                    <PreviewMediaWrapper media={memberInfo.media}>
                        <ImageDisplay
                            className=" aspect-square size-[6.5rem] rounded-xl duration-150 ease-in-out hover:scale-105"
                            src={memberInfo.media?.download_url}
                            onClick={() => {
                                onOpen({
                                    Images: [
                                        memberInfo.media as IMedia,
                                        memberInfo.signature_media as IMedia,
                                    ],
                                })
                            }}
                            fallback={memberInfo.first_name.charAt(0) ?? '-'}
                        />
                    </PreviewMediaWrapper>
                    <Button
                        variant={'secondary'}
                        size="sm"
                        className="text-xs w-full"
                        onClick={() => infoModal.onOpenChange(true)}
                    >
                        {' '}
                        View Profile
                    </Button>
                </div>
                <div className="grow space-y-3 min-w-[700px]">
                    <div className="flex items-center justify-between">
                        <div className="w-full flex items-center gap-x-2 justify-between">
                            <div className="flex w-fit items-center gap-x-2">
                                <h2 className="truncate font-bold">
                                    {memberInfo.full_name}
                                </h2>
                                {memberInfo.status === 'verified' && (
                                    <BadgeCheckIcon className="text-primary" />
                                )}
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={'ghost'}
                                        size="icon"
                                        onClick={() =>
                                            onOpen({
                                                Images: [
                                                    memberInfo.signature_media as IMedia,
                                                    memberInfo.media as IMedia,
                                                ],
                                            })
                                        }
                                    >
                                        <SignatureLightIcon size={25} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Signature</TooltipContent>
                            </Tooltip>
                        </div>
                        {memberInfo.user && (
                            <HoverCard>
                                <HoverCardTrigger>
                                    <ImageNameDisplay
                                        src={
                                            memberInfo.user?.media?.download_url
                                        }
                                        name={memberInfo.user.first_name}
                                        className="rounded-full bg-card/80 p-1 text-sm"
                                        nameClassName="mr-2"
                                    />
                                </HoverCardTrigger>
                                <HoverCardContent className="border-0 bg-transparent p-0">
                                    <HoveruserInfo
                                        userId={memberInfo.user.id}
                                        defaultValue={memberInfo.user}
                                    />
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </div>
                    <div className="flex justify-between space-x-5 pr-5 pt-2 text-xs">
                        <div>
                            <h3 className="mb-1 font-medium text-muted-foreground">
                                Contact Number
                            </h3>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="400 size-3" />
                                <span>
                                    <CopyWrapper>
                                        {memberInfo.contact_number}
                                    </CopyWrapper>
                                </span>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-1 font-medium text-muted-foreground">
                                Passbook Number
                            </h3>
                            <div className="flex items-center gap-2">
                                <IdCardIcon className="size-3" />
                                <span className="font-mono">
                                    <CopyWrapper>
                                        {memberInfo.passbook}
                                    </CopyWrapper>
                                </span>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-1 font-medium text-muted-foreground">
                                Member Type
                            </h3>
                            <div className="flex items-center gap-2">
                                <UserIcon className="size-3" />
                                <span>
                                    <CopyWrapper>
                                        {memberInfo.member_type.name}
                                    </CopyWrapper>
                                </span>
                            </div>
                        </div>
                        <div className="text-end">
                            <h3 className="mb-1 font-medium text-muted-foreground">
                                Member Profile ID
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="truncate font-mono">
                                    <CopyWrapper>{memberInfo.id}</CopyWrapper>
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="w-full"
                        variant={'secondary'}
                        onClick={() => setOpenJointList(true)}
                    >
                        View profiles of allowed people for transactions
                    </Button>
                </div>
            </GradientBackground>
        </div>
    )
}

export default MemberProfileTransactionView
