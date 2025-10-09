import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { CakeIcon } from 'lucide-react'

import {
    BadgeCheckIcon,
    EyeIcon,
    IdCardIcon,
    PhoneIcon,
    UserIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { IMemberProfile } from '..'
import { MemberOverallInfoModal } from './member-infos/view-member-info'

interface Props extends IClassProps {
    memberProfile: IMemberProfile
}

const MemberProfileInfoViewLoanCard = ({ className, memberProfile }: Props) => {
    const fullInfoViewModal = useModalState()

    return (
        <div className={cn('rounded ring-2 p-4 ring-primary/40', className)}>
            <div className="flex items-center gap-x-2">
                <div className="shrink-0 gap-x-2 items-center flex">
                    <PreviewMediaWrapper media={memberProfile.media}>
                        <ImageDisplay
                            className="size-18 rounded-sm ring-2 ring-secondary"
                            src={memberProfile.media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <PreviewMediaWrapper media={memberProfile.signature_media}>
                        <ImageDisplay
                            className="size-18 rounded-sm ring-2 ring-secondary"
                            imageClassName="bg-gray-300"
                            src={memberProfile.signature_media?.download_url}
                        />
                    </PreviewMediaWrapper>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="w-full flex items-center gap-x-2 justify-between">
                            <div className="flex w-fit items-center gap-x-2">
                                <h2 className="truncate font-bold">
                                    {memberProfile.full_name}
                                </h2>
                                {memberProfile.status === 'verified' && (
                                    <BadgeCheckIcon className="text-primary" />
                                )}
                            </div>
                        </div>
                        {memberProfile && (
                            <MemberOverallInfoModal
                                {...fullInfoViewModal}
                                overallInfoProps={{
                                    memberProfileId: memberProfile.id,
                                    defaultMemberProfile: memberProfile,
                                }}
                            />
                        )}
                        <Button
                            className="size-fit col-span-3 p-1.5 text-xs opacity-80 underline"
                            disabled={!memberProfile}
                            onClick={() => fullInfoViewModal.onOpenChange(true)}
                            size="icon"
                            type="button"
                            variant="ghost"
                        >
                            See full info
                            <EyeIcon className="size-3" />
                        </Button>
                    </div>

                    <Separator />
                    <div className="flex justify-between flex-wrap space-y-4 space-x-5 pr-5 pt-2 text-xs">
                        <div className="shrink-0">
                            <h3 className="mb-1 font-medium text-muted-foreground">
                                Contact Number
                            </h3>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="400 size-3" />
                                <span>
                                    <CopyWrapper>
                                        {memberProfile.contact_number}
                                    </CopyWrapper>
                                </span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <h3 className="mb-1 font-medium text-muted-foreground">
                                Passbook Number
                            </h3>
                            <div className="flex items-center gap-2">
                                <IdCardIcon className="size-3" />
                                <span className="font-mono">
                                    <CopyWrapper>
                                        {memberProfile.passbook}
                                    </CopyWrapper>
                                </span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <h3 className="mb-1 font-medium text-muted-foreground">
                                Member Type
                            </h3>
                            <div className="flex items-center gap-2">
                                <UserIcon className="size-3" />
                                <span>
                                    {memberProfile.member_type ? (
                                        <CopyWrapper>
                                            {memberProfile.member_type?.name}
                                        </CopyWrapper>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            ...
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <h3 className="mb-1 font-medium text-muted-foreground">
                                Birthday
                            </h3>
                            <div className="flex items-center gap-2">
                                <CakeIcon className="size-3" />
                                <span>
                                    {memberProfile?.birthdate ? (
                                        <CopyWrapper>
                                            {toReadableDate(
                                                memberProfile?.birthdate
                                            )}
                                        </CopyWrapper>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            ...
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberProfileInfoViewLoanCard
