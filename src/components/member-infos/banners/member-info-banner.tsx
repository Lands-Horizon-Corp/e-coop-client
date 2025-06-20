import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'

import {
    PencilFillIcon,
    WarningFillIcon,
    BadgeCheckFillIcon,
    HeartBreakFillIcon,
    BadgeQuestionFillIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ImageDisplay from '@/components/image-display'
import CopyTextButton from '@/components/copy-text-button'
import { MemberProfileCloseFormModal } from '@/components/forms/member-forms/member-profile-close-form'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IMemberProfile } from '@/types'
import { useImagePreview } from '@/store/image-preview-store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import ProfileClosureContent from '@/components/elements/modal-displays/profile-closure-content'

interface Props extends IClassProps {
    memberProfile: IMemberProfile
}

const MemberInfoBanner = ({ className, memberProfile }: Props) => {
    const router = useRouter()
    const { onOpen } = useConfirmModalStore()
    const { onOpen: onOpenImage } = useImagePreview()
    const [closeMemberAccount, setCloseMemberAccount] = useState(false)

    return (
        <div className={cn('flex justify-between', className)}>
            <MemberProfileCloseFormModal
                open={closeMemberAccount}
                onOpenChange={setCloseMemberAccount}
                formProps={{
                    profileId: memberProfile.id,
                    defaultValues: {
                        remarks: memberProfile.member_close_remarks ?? [],
                    },
                }}
            />
            <div className="flex gap-x-6">
                <ImageDisplay
                    className="size-32 !rounded-xl"
                    fallbackClassName="!rounded-xl"
                    onClick={() =>
                        memberProfile.media &&
                        onOpenImage({ Images: [memberProfile.media] })
                    }
                    src={memberProfile.media?.download_url ?? ''}
                />

                <div className="w-fit space-y-1">
                    <p className="text-xl">{`${memberProfile.full_name ?? 'no name'}`}</p>
                    <p className="text-sm text-muted-foreground/80">
                        {`${memberProfile.user?.email ?? 'no email'}`}
                        {memberProfile.user && (
                            <>
                                {memberProfile.user.is_email_verified ? (
                                    <BadgeCheckFillIcon className="ml-1 inline text-primary" />
                                ) : (
                                    <BadgeQuestionFillIcon className="ml-1 inline text-amber-400" />
                                )}
                            </>
                        )}
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                        {`${memberProfile.user?.contact_number ?? 'no email'}`}
                        {memberProfile.user && (
                            <>
                                {memberProfile.user.is_contact_verified ? (
                                    <BadgeCheckFillIcon className="ml-1 inline text-primary" />
                                ) : (
                                    <BadgeQuestionFillIcon className="ml-1 inline text-amber-400" />
                                )}
                            </>
                        )}
                    </p>
                    <p className="!mt-4 truncate whitespace-nowrap text-muted-foreground/90">
                        {`${memberProfile.passbook ?? 'PB Missing'}`}
                        {memberProfile.passbook && (
                            <CopyTextButton
                                className="ml-2"
                                successText="Passbook Number Copied"
                                textContent={memberProfile.passbook}
                            />
                        )}
                    </p>
                    <div className="shadow-xs inline-flex -space-x-px rounded-md rtl:space-x-reverse">
                        <Button
                            size="sm"
                            variant="outline"
                            hoverVariant="secondary"
                            onClick={() => {
                                router.navigate({
                                    to: `/org/$orgname/branch/$branchname/member-profile/${memberProfile.id}/personal-info` as string,
                                })
                            }}
                            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                        >
                            <PencilFillIcon className="mr-2 size-4" /> Edit
                            Profile
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            hoverVariant="destructive"
                            disabled={memberProfile.is_closed}
                            className="group rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                            onClick={() =>
                                onOpen({
                                    title: (
                                        <span>
                                            <HeartBreakFillIcon className="mr-2 inline size-6 text-destructive" />
                                            Close Account
                                        </span>
                                    ),
                                    description:
                                        'Closing this member’s account will permanently deactivate their membership and revoke all associated benefits and privileges. This includes:',
                                    content: <ProfileClosureContent />,
                                    onConfirm: () => {
                                        setCloseMemberAccount(true)
                                        toast(
                                            'Please add account closure reason'
                                        )
                                    },
                                })
                            }
                        >
                            <HeartBreakFillIcon className="mr-2 size-4 text-muted-foreground/40 duration-500 ease-out group-hover:text-inherit" />{' '}
                            Close Account
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end space-y-1.5">
                <span>
                    <Badge variant="default" className="gap-1.5">
                        {memberProfile.member_type?.name}
                    </Badge>
                </span>
                {memberProfile.is_closed && (
                    <Badge variant="destructive" className="bg-rose-500">
                        <WarningFillIcon className="mr-1 inline text-rose-200" />
                        Closed Account
                    </Badge>
                )}
                <p className="!mt-4 truncate whitespace-nowrap text-xs text-muted-foreground/60">
                    <span>Profile ID: </span>
                    {`${memberProfile.id ?? 'no id'}`}
                    {memberProfile.id && (
                        <CopyTextButton
                            className="ml-1"
                            textContent={memberProfile.id}
                            successText="Member profile ID copied"
                        />
                    )}
                </p>
                <p className="truncate whitespace-nowrap text-xs text-muted-foreground/60">
                    <span>Member User ID: </span>
                    {`${memberProfile.user?.id ?? 'no id'}`}
                    {memberProfile.user?.id && (
                        <CopyTextButton
                            className="ml-1"
                            successText="Member User ID copied"
                            textContent={memberProfile.user?.id}
                        />
                    )}
                </p>
            </div>
        </div>
    )
}

export default MemberInfoBanner
