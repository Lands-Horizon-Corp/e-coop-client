import { useState } from 'react'
import { toast } from 'sonner'

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
import MemberOverallInfo, {
    MemberOverallInfoModal,
} from '@/components/member-infos/view-member-info'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IMedia, IMemberJointAccount, IMemberProfile, TEntityId } from '@/types'

import JointMemberProfileListModal from './joint-member-profile-list-modal'

type MemberProfileTransactionViewProps = {
    memberInfo: IMemberProfile | null
    onSelectMember: () => void
    onSelectedJointMember?: (jointMemberId: TEntityId | undefined) => void
    hasTransaction?: boolean
    viewOnly?: boolean
}

const MemberProfileTransactionView = ({
    memberInfo,
    onSelectMember,
    onSelectedJointMember,
    hasTransaction,
    viewOnly = false,
}: MemberProfileTransactionViewProps) => {
    const infoModal = useModalState(false)
    const { onOpen } = useImagePreview()

    const [selectedJointMember, setSelectedJointMember] =
        useState<IMemberJointAccount | null>(null)

    onSelectedJointMember?.(selectedJointMember?.id)

    const handleMedia = (media: IMedia | undefined) => {
        if (media) {
            onOpen({
                Images: [media],
            })
        } else {
            toast.warning('No media available for preview.')
        }
    }

    const handleImageClick = (media: IMedia | undefined, type: string) => {
        if (type === 'profile') {
            handleMedia(media)
        }
        if (type === 'signature') {
            handleMedia(media)
        }
    }

    if (!memberInfo) return null

    return (
        <>
            <MemberOverallInfoModal
                {...infoModal}
                overallInfoProps={{
                    memberProfileId: memberInfo.id,
                }}
            />
            <GradientBackground
                gradientOnly
                opacity={0}
                className="w-full ecoop-scroll overflow-x-auto  h-fit flex-col space-y-2 border-[0.5px] min-w-[300px] overscroll-contain bg-sidebar/20 p-5"
            >
                <div className="flex w-full  space-x-5 items-center h-fit ">
                    <div className="flex items-center h-fit gap-y-1 flex-col min-w-[6vw] max-w-[5vw]">
                        <div className="flex-shrink-0">
                            <PreviewMediaWrapper media={memberInfo.media}>
                                <ImageDisplay
                                    className="size-24"
                                    src={memberInfo.media?.download_url}
                                    fallback={
                                        memberInfo.first_name.charAt(0) ?? '-'
                                    }
                                />
                            </PreviewMediaWrapper>
                        </div>
                        <Drawer>
                            <DrawerTrigger asChild className="">
                                <Button
                                    variant={'secondary'}
                                    size="sm"
                                    className="text-xs w-full h-7 min-w-24"
                                >
                                    View Profile
                                </Button>
                            </DrawerTrigger>
                            {!viewOnly && (
                                <Button
                                    size="sm"
                                    className="w-full h-7 min-w-24"
                                    disabled={hasTransaction}
                                    onClick={onSelectMember}
                                >
                                    select
                                </Button>
                            )}
                            <DrawerContent className="h-full w-full">
                                <MemberOverallInfo
                                    className="overflow-y-auto px-5"
                                    memberProfileId={memberInfo?.id}
                                />
                            </DrawerContent>
                        </Drawer>
                    </div>
                    <div className="h-full min-w-fit flex flex-col justify-start w-full">
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
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleImageClick(
                                                    memberInfo.signature_media,
                                                    'signature'
                                                )
                                            }}
                                        >
                                            <SignatureLightIcon size={25} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        View Signature
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            {memberInfo.user && (
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <ImageNameDisplay
                                            src={
                                                memberInfo.user?.media
                                                    ?.download_url
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
                        <div className="text-xs pb-2">
                            <h3 className="mb-1 font-medium text-muted-foreground">
                                Member Profile ID
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="truncate font-mono">
                                    <CopyWrapper>{memberInfo.id}</CopyWrapper>
                                </span>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex  justify-between space-x-5 pr-5 pt-2 text-xs">
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
                                            {memberInfo.member_type?.name}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!viewOnly && (
                    <JointMemberProfileListModal
                        triggerProps={{
                            disabled: hasTransaction,
                        }}
                        onSelect={(jointMember) => {
                            setSelectedJointMember(jointMember || null)
                        }}
                        value={selectedJointMember?.id}
                        selectedMemberJointId={selectedJointMember?.id}
                        memberJointProfile={
                            memberInfo.member_joint_accounts ?? []
                        }
                    />
                )}
            </GradientBackground>
        </>
    )
}

export default MemberProfileTransactionView
