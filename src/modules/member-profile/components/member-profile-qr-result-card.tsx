import { toReadableDate } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import GeneralStatusBadge from '@/modules/authentication/components/general-status-badge'

import { EyeIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { IMemberProfile } from '..'
import { MemberOverallInfoModal } from './member-infos/view-member-info'

interface Props extends IClassProps {
    memberProfile: IMemberProfile | undefined
}

const MemberProfileQrResultCard = ({ className, memberProfile }: Props) => {
    const fullInfoViewModal = useModalState()

    return (
        <div className={cn('min-w-[500px] space-y-4', className)}>
            {memberProfile && (
                <MemberOverallInfoModal
                    {...fullInfoViewModal}
                    overallInfoProps={{
                        memberProfileId: memberProfile.id,
                        defaultMemberProfile: memberProfile,
                    }}
                />
            )}
            <div className="flex gap-x-2 items-center pt-4 justify-between">
                <div className="flex flex-col mx-auto gap-y-2 items-center">
                    <PreviewMediaWrapper media={memberProfile?.media}>
                        <ImageDisplay
                            className="size-32"
                            src={memberProfile?.media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <div className="space-y-1">
                        <p className="text-lg text-center">
                            {memberProfile?.full_name ?? '.....'}
                        </p>
                        <div className="space-y-1">
                            <p className="text-sm w-full text-center text-muted-foreground">
                                {memberProfile?.passbook ?? '.....'}
                            </p>
                            <Separator />
                            <p className="text-xs text-muted-foreground/60 text-center">
                                Passbook
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={cn(
                    'bg-card relative p-4 gap-4 grid grid-cols-3 rounded-xl bg-gradient-to-br from-primary/10 to-background border-primary/40',
                    memberProfile?.is_closed &&
                        'from-destructive/10 border-destructive/40'
                )}
            >
                <div className="space-y-1 inline">
                    <p>{memberProfile?.member_type?.name ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/80">
                        Member Type
                    </p>
                </div>

                <div className="space-y-1 inline">
                    <p className="font-medium">
                        {memberProfile?.member_gender?.name ?? '-'}
                    </p>
                    <p className="text-xs text-muted-foreground/80">Gender</p>
                </div>

                <div className="space-y-1 inline">
                    <p className="font-medium">
                        {memberProfile?.birthdate
                            ? toReadableDate(memberProfile?.birthdate)
                            : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        Date of Birth
                    </p>
                </div>

                <div className="space-y-1 inline">
                    <p className="font-medium">
                        {memberProfile?.member_group?.name ?? '-'}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        Member Group
                    </p>
                </div>

                <div className="space-y-1 inline">
                    <GeneralStatusBadge
                        generalStatus={
                            memberProfile?.status as unknown as string
                        }
                    />
                    <p className="text-xs text-muted-foreground/80">Status</p>
                </div>

                <div className="space-y-1 inline">
                    <p className="font-medium">
                        {memberProfile?.member_classification?.name ?? '-'}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        Classification
                    </p>
                </div>
                <Button
                    size="icon"
                    variant="secondary"
                    disabled={!memberProfile}
                    onClick={() => fullInfoViewModal.onOpenChange(true)}
                    className="size-fit col-span-3 w-full p-1.5 text-xs text-muted-foreground/70"
                >
                    <EyeIcon className="mr-2" />
                    See full info
                </Button>
            </div>
        </div>
    )
}

export default MemberProfileQrResultCard
