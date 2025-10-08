import { useState } from 'react'

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
    allowRemoveButton?: boolean
    onRemove?: () => void
}

const TransactionMemberProfile = ({
    memberInfo,
    onSelectedJointMember,
    hasTransaction,
    viewOnly = false,
    className,
    allowRemoveButton = false,
    onRemove,
}: MemberProfileTransactionViewProps) => {
    const infoModal = useModalState(false)
    const { onOpen } = useImagePreview()

    const [selectedJointMember, setSelectedJointMember] =
        useState<IMemberJointAccount | null>(null)

    onSelectedJointMember?.(selectedJointMember?.id)

    useHotkeys('Alt+V', () => {
        infoModal.onOpenChange(() => !infoModal.open)
    })
    if (!memberInfo) return null

    return (
        <div className="ecoop-scroll overflow-y-auto border size-full rounded-2xl bg-gradient-to-br from-primary/10 to-background border-primary/90">
            <MemberOverallInfoModal
                {...infoModal}
                overallInfoProps={{
                    memberProfileId: memberInfo.id,
                }}
            />
            <div
                className={cn(
                    'w-full ecoop-scroll md:min-w-2xl rounded-2xl overflow-y-auto h-fit flex flex-col md:justify-between space-y-2 overscroll-contain bg-gradient-to-br from-primary/10 to-background border-primary/40 p-5',
                    className
                )}
            >
                {/* Main container: stacks on mobile, becomes a row on larger screens */}
                <div className="flex w-full flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 items-center sm:items-start h-fit">
                    {/* Left section: member image and profile button */}
                    <div className="flex items-center h-fit gap-y-1 flex-col min-w-24 max-w-xs">
                        <div className="flex-shrink-0">
                            <PreviewMediaWrapper media={memberInfo.media}>
                                <ImageDisplay
                                    className="size-16"
                                    fallback={
                                        memberInfo.first_name.charAt(0) ?? '-'
                                    }
                                    src={memberInfo.media?.download_url}
                                />
                            </PreviewMediaWrapper>
                        </div>
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button
                                    className="text-xs w-full h-7 min-w-24 cursor-pointer mt-2 sm:mt-0"
                                    size="sm"
                                    variant="outline"
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
                        {allowRemoveButton && (
                            <Button
                                className="text-xs w-full h-7 min-w-24 cursor-pointer mt-2 sm:mt-0"
                                onClick={(e) => {
                                    e.preventDefault()
                                    onRemove?.()
                                }}
                                size="sm"
                                variant="destructive"
                            >
                                remove
                            </Button>
                        )}
                    </div>

                    {/* Right section: member details */}
                    <div className="h-full   w-full flex flex-col justify-start space-y-2">
                        <div className="flex flex-wrap md:flex-nowrap md:items-center md:justify-between">
                            <div className="w-full flex items-center gap-x-2 justify-between">
                                <div className="flex w-fit items-center gap-x-2">
                                    <h2 className="truncate font-bold text-lg sm:text-xl">
                                        {memberInfo.full_name}
                                    </h2>
                                    {memberInfo.status === 'verified' && (
                                        <BadgeCheckIcon className="text-primary" />
                                    )}
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {memberInfo.signature && (
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    onOpen({
                                                        Images: [
                                                            memberInfo.signature_media,
                                                        ] as IMedia[],
                                                    })
                                                }}
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <SignatureLightIcon size={25} />
                                            </Button>
                                        )}
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
                                            className="rounded-full bg-card/80 p-1 text-sm"
                                            name={memberInfo.user.first_name}
                                            nameClassName="mr-2"
                                            src={
                                                memberInfo.user?.media
                                                    ?.download_url
                                            }
                                        />
                                    </HoverCardTrigger>
                                    <HoverCardContent className="border-0 bg-transparent p-0">
                                        <HoveruserInfo
                                            defaultValue={memberInfo.user}
                                            userId={memberInfo.user.id}
                                        />
                                    </HoverCardContent>
                                </HoverCard>
                            )}
                        </div>

                        <Separator />

                        {/* Details section: stacks on mobile, becomes a row on larger screens */}
                        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-5 pt-2 text-xs">
                            <div className="text-center sm:text-left">
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Contact Number
                                </h3>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <PhoneIcon className="size-3" />
                                    <span>
                                        <CopyWrapper>
                                            {memberInfo.contact_number}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Passbook Number
                                </h3>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <IdCardIcon className="size-3" />
                                    <span className="font-mono">
                                        <CopyWrapper>
                                            {memberInfo.passbook}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Member Type
                                </h3>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
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
                        memberJointProfile={
                            memberInfo.member_joint_accounts ?? []
                        }
                        onSelect={(jointMember) =>
                            setSelectedJointMember(jointMember || null)
                        }
                        selectedMemberJointId={selectedJointMember?.id}
                        triggerProps={{ disabled: hasTransaction }}
                        value={selectedJointMember?.id}
                    />
                )}
            </div>
        </div>
    )
}

export default TransactionMemberProfile
