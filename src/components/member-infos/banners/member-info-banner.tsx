import { toast } from 'sonner'
import { useState } from 'react'

import {
    PencilFillIcon,
    WarningFillIcon,
    BadgeCheckFillIcon,
    HeartBreakFillIcon,
    BadgeQuestionFillIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CopyTextButton from '@/components/copy-text-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MemberProfileCloseFormModal } from '@/components/forms/member-forms/member-profile-close-form'
import { MemberProfileCreateUpdateFormModal } from '@/components/forms/member-forms/member-application-form/member-profile-create-update-form'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IMemberProfile } from '@/types'
import useConfirmModalStore from '@/store/confirm-modal-store'
import ImageDisplay from '@/components/image-display'
import { useImagePreview } from '@/store/image-preview-store'

interface Props extends IClassProps {
    memberProfile: IMemberProfile
}

const MemberInfoBanner = ({ className, memberProfile }: Props) => {
    const { onOpen } = useConfirmModalStore()
    const { onOpen: onOpenImage } = useImagePreview()
    const [editProfile, setEditProfile] = useState(false)
    const [closeMemberAccount, setCloseMemberAccount] = useState(false)

    return (
        <div className={cn('flex justify-between', className)}>
            <MemberProfileCreateUpdateFormModal
                open={editProfile}
                onOpenChange={setEditProfile}
                formProps={{
                    profileId: memberProfile.id,
                    defaultValues: memberProfile,
                }}
            />
            <MemberProfileCloseFormModal
                open={closeMemberAccount}
                onOpenChange={setCloseMemberAccount}
                formProps={{
                    profileId: memberProfile.id,
                    defaultValues: {
                        remarks: memberProfile.memberCloseRemarks ?? [],
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
                    src={memberProfile.media?.downloadURL ?? ''}
                />

                <div className="w-fit space-y-1">
                    <p className="text-xl">{`${memberProfile.member?.fullName ?? 'no name'}`}</p>
                    <p className="text-sm text-muted-foreground/80">
                        {`${memberProfile.member?.email ?? 'no email'}`}
                        {memberProfile.member && (
                            <>
                                {memberProfile.member.isEmailVerified ? (
                                    <BadgeCheckFillIcon className="ml-1 inline text-primary" />
                                ) : (
                                    <BadgeQuestionFillIcon className="ml-1 inline text-amber-400" />
                                )}
                            </>
                        )}
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                        {`${memberProfile.member?.contactNumber ?? 'no email'}`}
                        {memberProfile.member && (
                            <>
                                {memberProfile.member.isContactVerified ? (
                                    <BadgeCheckFillIcon className="ml-1 inline text-primary" />
                                ) : (
                                    <BadgeQuestionFillIcon className="ml-1 inline text-amber-400" />
                                )}
                            </>
                        )}
                    </p>
                    <p className="!mt-4 truncate whitespace-nowrap text-muted-foreground/90">
                        {`${memberProfile.passbookNumber ?? 'PB Missing'}`}
                        {memberProfile.passbookNumber && (
                            <CopyTextButton
                                className="ml-2"
                                successText="Passbook Number Copied"
                                textContent={memberProfile.passbookNumber}
                            />
                        )}
                    </p>
                    <div className="shadow-xs inline-flex -space-x-px rounded-md rtl:space-x-reverse">
                        <Button
                            size="sm"
                            variant="outline"
                            hoverVariant="secondary"
                            onClick={() => setEditProfile(true)}
                            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                        >
                            <PencilFillIcon className="mr-2 size-4" /> Edit
                            Profile
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            hoverVariant="destructive"
                            disabled={memberProfile.isClosed}
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
                                    content: (
                                        <div className="space-y-4">
                                            <ul className="list-disc space-y-2 pl-6 text-sm">
                                                <li>
                                                    Loss of access to
                                                    cooperative services,
                                                    including loans, savings,
                                                    and other financial
                                                    benefits.
                                                </li>
                                                <li>
                                                    Removal from all
                                                    member-related activities,
                                                    voting rights, and dividends
                                                    (if applicable).
                                                </li>
                                                <li>
                                                    Any outstanding obligations,
                                                    such as unpaid loans or
                                                    fees, must be settled before
                                                    closure.
                                                </li>
                                                <li>
                                                    Funds from the member’s
                                                    account will be processed
                                                    according to cooperative
                                                    policies.
                                                </li>
                                            </ul>
                                            <Alert
                                                variant="default"
                                                className="bg-rose-400/40 text-foreground dark:bg-rose-400"
                                            >
                                                <WarningFillIcon />
                                                <AlertDescription>
                                                    This action is irreversible.
                                                    Please confirm that all
                                                    necessary checks have been
                                                    completed before proceeding.
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    ),
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
                        {memberProfile.memberType?.name}
                    </Badge>
                </span>
                {memberProfile.isClosed && (
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
                    <span>Member ID: </span>
                    {`${memberProfile.member?.id ?? 'no id'}`}
                    {memberProfile.member?.id && (
                        <CopyTextButton
                            className="ml-1"
                            successText="Member ID copied"
                            textContent={memberProfile.member?.id}
                        />
                    )}
                </p>
            </div>
        </div>
    )
}

export default MemberInfoBanner
