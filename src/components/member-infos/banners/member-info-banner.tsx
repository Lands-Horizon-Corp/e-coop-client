import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useRouter } from '@tanstack/react-router'

import MemberProfileMiniInfoCard from '@/components/elements/member-profile-mini-info-card'
import ProfileClosureContent from '@/components/elements/modal-displays/profile-closure-content'
import { MemberProfileCloseFormModal } from '@/components/forms/member-forms/member-profile-close-form'
import { HeartBreakFillIcon, PencilFillIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'
import { IMemberProfile } from '@/types'

interface Props extends IClassProps {
    memberProfile: IMemberProfile
}

const MemberInfoBanner = ({ className, memberProfile }: Props) => {
    const router = useRouter()
    const { onOpen } = useConfirmModalStore()
    const [closeMemberAccount, setCloseMemberAccount] = useState(false)

    return (
        <div className={cn('space-y-2', className)}>
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
            <MemberProfileMiniInfoCard memberProfile={memberProfile} />
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
                    <PencilFillIcon className="mr-2 size-4" /> Edit Profile
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
                                toast('Please add account closure reason')
                            },
                        })
                    }
                >
                    <HeartBreakFillIcon className="mr-2 size-4 text-muted-foreground/40 duration-500 ease-out group-hover:text-inherit" />{' '}
                    Close Account
                </Button>
            </div>
        </div>
    )
}

export default MemberInfoBanner
