import { useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { IMedia } from '@/modules/media'
import { IMemberJointAccount } from '@/modules/member-joint-account'
import { IMemberProfile } from '@/modules/member-profile'
import MemberOverallInfo, {
    MemberOverallInfoModal,
} from '@/modules/member-profile/components/member-infos/view-member-info'
import HoveruserInfo from '@/modules/user/components/hover-user-info'
import { useImagePreview } from '@/store/image-preview-store'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    BadgeCheckIcon,
    IdCardIcon,
    PhoneIcon,
    SignatureLightIcon,
    UserIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import ImageNameDisplay from '@/components/image-name-display'
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
import CopyWrapper from '@/components/wrappers/copy-wrapper'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import TransactionModalJointMember from './transaction-modal-joint-member'

export type MemberProfileTransactionViewProps = {
    memberInfo: IMemberProfile | null
    onSelectedJointMember?: (jointMemberId: TEntityId | undefined) => void
    hasTransaction?: boolean
    viewOnly?: boolean
    className?: string
}

const TransactionMemberProfile = ({
    memberInfo,
    onSelectedJointMember,
    hasTransaction,
    viewOnly = false,
    className,
}: MemberProfileTransactionViewProps) => {
    const infoModal = useModalState(false)
    const { onOpen } = useImagePreview()

    const [selectedJointMember, setSelectedJointMember] =
        useState<IMemberJointAccount | null>(null)

    onSelectedJointMember?.(selectedJointMember?.id)

    const handleMedia = (media: IMedia[] | undefined) => {
        if (media) {
            onOpen({
                Images: media,
            })
        } else {
            toast.warning('No media available for preview.')
        }
    }

    useHotkeys('Alt+V', () => {
        infoModal.onOpenChange(() => !infoModal.open)
    })

    if (!memberInfo) return null
    const memberMedias = [memberInfo.media, memberInfo.signature_media].filter(
        (media): media is IMedia => !!media
    )

    return (
        <>
            <MemberOverallInfoModal
                {...infoModal}
                overallInfoProps={{
                    memberProfileId: memberInfo.id,
                }}
            />
            <div
                className={cn(
                    'w-full ecoop-scroll rounded-2xl overflow-x-auto h-fit flex flex-col justify-between space-y-2 min-w-[300px] overscroll-contain bg-card bg-gradient-to-br from-primary/10 to-background border-primary/40 p-5',
                    className
                )}
            >
                <div className="flex w-full space-x-5 items-center h-fit ">
                    <div className="flex items-center h-fit gap-y-1 flex-col min-w-[6vw] max-w-[5vw]">
                        <div className="flex-shrink-0">
                            <PreviewMediaWrapper media={memberInfo.media}>
                                <ImageDisplay
                                    className="size-16"
                                    onClick={() => handleMedia(memberMedias)}
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
                                    variant={'outline'}
                                    size="sm"
                                    className="text-xs w-full h-7 min-w-24 cursor-pointer"
                                >
                                    View Profile
                                </Button>
                            </DrawerTrigger>
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
                                                handleMedia(memberMedias)
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
                    <TransactionModalJointMember
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
            </div>
        </>
    )
}

export default TransactionMemberProfile
