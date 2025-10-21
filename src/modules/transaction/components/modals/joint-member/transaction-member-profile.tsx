import { useState } from 'react'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { IMemberJointAccount } from '@/modules/member-joint-account'
import { IMemberProfile } from '@/modules/member-profile'
import MemberOverallInfo, {
    MemberOverallInfoModal,
} from '@/modules/member-profile/components/member-infos/view-member-info'
import { useHotkeys } from 'react-hotkeys-hook'

import { XIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
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

    const [selectedJointMember, setSelectedJointMember] =
        useState<IMemberJointAccount | null>(null)

    onSelectedJointMember?.(selectedJointMember?.id)

    useHotkeys('Alt+V', () => {
        infoModal.onOpenChange(() => !infoModal.open)
    })
    if (!memberInfo) return null

    /*


               

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

            */

    return (
        <div className="ecoop-scroll flex flex-1 items-center gap-x-2">
            <MemberOverallInfoModal
                {...infoModal}
                overallInfoProps={{
                    memberProfileId: memberInfo.id,
                }}
            />

            {/* MEMBER INFO VIEW */}
            <div className="rounded-2xl flex-1 bg-gradient-to-br from-primary/10 to-background border-primary/90">
                <div
                    className={cn(
                        'rounded-2xl flex-1 h-fit flex space-y-2 overscroll-contain bg-gradient-to-br from-primary/10 to-background border border-primary/40 p-3',
                        className
                    )}
                >
                    <div className="flex-shrink-0 relative flex-1 flex items-center gap-2">
                        <PreviewMediaWrapper media={memberInfo.media}>
                            <ImageDisplay
                                className="size-16 ring-3 ring-primary"
                                fallback={
                                    memberInfo.first_name.charAt(0) ?? '-'
                                }
                                src={memberInfo.media?.download_url}
                            />
                        </PreviewMediaWrapper>
                        <div className="flex-1">
                            <div className="grid gap-x-4 gap-y-2 text-sm grid-cols-2">
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <p className="truncate cursor-pointer hover:underline">
                                            {memberInfo.full_name}
                                        </p>
                                    </DrawerTrigger>
                                    <DrawerContent className="h-full w-full">
                                        <MemberOverallInfo
                                            className="overflow-y-auto px-5"
                                            memberProfileId={memberInfo?.id}
                                        />
                                    </DrawerContent>
                                </Drawer>
                                <CopyWrapper>
                                    <p className="inline">
                                        {memberInfo.passbook}
                                    </p>
                                </CopyWrapper>
                                <CopyWrapper>
                                    <p className="text-sm inline">
                                        {memberInfo.contact_number}
                                    </p>
                                </CopyWrapper>
                                <p className="text-xs text-muted-foreground inline">
                                    {toReadableDate(memberInfo.created_at)} -{' '}
                                    {dateAgo(memberInfo.created_at)}
                                </p>
                            </div>
                            {memberInfo?.member_type?.name && (
                                <p className="absolute left-1.5 drop-shadow -bottom-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md ">
                                    {memberInfo?.member_type?.name}
                                </p>
                            )}
                        </div>
                        {/* FOR ACTIONS (Joint Account, Remove)*/}
                        <div
                            className="space-y-2 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {!viewOnly && (
                                <TransactionModalJointMember
                                    memberJointProfile={
                                        memberInfo.member_joint_accounts ?? []
                                    }
                                    onSelect={(jointMember) =>
                                        setSelectedJointMember(
                                            jointMember || null
                                        )
                                    }
                                    selectedMemberJointId={
                                        selectedJointMember?.id
                                    }
                                    triggerProps={{
                                        disabled: hasTransaction,
                                    }}
                                    value={selectedJointMember?.id}
                                />
                            )}
                            {memberInfo && (
                                <Button
                                    disabled={!allowRemoveButton}
                                    hoverVariant="destructive"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onRemove?.()
                                    }}
                                    size="icon"
                                    variant="outline"
                                >
                                    <XIcon />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionMemberProfile
