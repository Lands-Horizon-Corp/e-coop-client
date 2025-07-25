import { cn } from '@/lib'
import { toReadableDate } from '@/utils'

import GeneralStatusBadge from '@/components/badges/general-status-badge'
import { EyeIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { MemberOverallInfoModal } from '@/components/member-infos/view-member-info'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IMemberProfile } from '@/types'

interface Props extends IClassProps {
    memberProfile: IMemberProfile
}

const MemberProfileQrResultCard = ({ className, memberProfile }: Props) => {
    const fullInfoViewModal = useModalState()

    const {
        id,
        media,
        passbook,
        full_name,
        birthdate,
        member_type,
        member_gender,
        member_classification,
        is_closed,
        status,
    } = memberProfile

    return (
        <div className={cn('min-w-[500px] space-y-4', className)}>
            <MemberOverallInfoModal
                {...fullInfoViewModal}
                overallInfoProps={{
                    memberProfileId: id,
                    defaultMemberProfile: memberProfile,
                }}
            />
            <div className="flex gap-x-2 items-center pt-4 justify-between">
                <div className="flex flex-col mx-auto gap-y-2 items-center">
                    <PreviewMediaWrapper media={media}>
                        <ImageDisplay
                            className="size-32"
                            src={media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <div className="space-y-1">
                        <p className="text-lg">{full_name}</p>
                        <div className="space-y-1">
                            <p className="text-sm w-full text-center text-muted-foreground">
                                {passbook}
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
                    is_closed && 'from-destructive/10 border-destructive/40'
                )}
            >
                <div className="space-y-1 inline">
                    <p>{member_type?.name ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/80">
                        Member Type
                    </p>
                </div>

                <div className="space-y-1 inline">
                    <p className="font-medium">{member_gender?.name ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/80">Gender</p>
                </div>

                <div className="space-y-1 inline">
                    <p className="font-medium">
                        {birthdate ? toReadableDate(birthdate) : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        Date of Birth
                    </p>
                </div>

                <div className="space-y-1 inline">
                    <p className="font-medium">
                        {birthdate ? toReadableDate(birthdate) : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        Classification
                    </p>
                </div>

                <div className="space-y-1 inline">
                    <GeneralStatusBadge generalStatus={status} />
                    <p className="text-xs text-muted-foreground/80">Status</p>
                </div>

                <div className="space-y-1 inline">
                    <p className="font-medium">
                        {member_classification?.name ?? '-'}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        Classification
                    </p>
                </div>
                <Button
                    size="icon"
                    variant="secondary"
                    className="size-fit col-span-3 w-full p-1.5 text-xs text-muted-foreground/70"
                    onClick={() => fullInfoViewModal.onOpenChange(true)}
                >
                    <EyeIcon className="mr-2" />
                    See full info
                </Button>
            </div>
        </div>
    )
}

export default MemberProfileQrResultCard
