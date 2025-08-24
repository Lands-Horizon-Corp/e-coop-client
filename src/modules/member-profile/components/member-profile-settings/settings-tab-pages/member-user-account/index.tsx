import { forwardRef } from 'react'

import { cn } from '@/helpers'
import {
    IMemberProfile,
    useConnectMemberProfileToUserAccount,
    useDisconnectMemberProfileUserAccount,
} from '@/modules/member-profile'
import { IMember } from '@/modules/user'
import { IUserOrganization } from '@/modules/user-organization'
import UserOrganizationPicker from '@/modules/user-organization/components/user-organization-picker'
import useActionSecurityStore from '@/store/action-security-store'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    LinkIcon,
    PlugConnectFillIcon,
    UnlinkIcon,
    UserPlusIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import ProfileConnectUserModalDisplay from '../../../profile-connect-user-content'
import UserAccountCardMini from './member-account-card-mini'
import { MemberUserAccountCreateUpdateFormModal } from './member-account-create-update-form'

interface Props {
    memberProfile: IMemberProfile
}

const MemberUserAccount = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        const createUserModal = useModalState()
        const connectUserModal = useModalState()

        const { onOpen } = useConfirmModalStore()
        const { onOpenSecurityAction } = useActionSecurityStore()

        const { mutate: connect, isPending: isConnecting } =
            useConnectMemberProfileToUserAccount()
        const { mutate: disconnect, isPending: isDisconnecting } =
            useDisconnectMemberProfileUserAccount()

        return (
            <div ref={ref}>
                <p className="mb-2">Member User Profile</p>

                {memberProfile.user !== undefined ? (
                    <div>
                        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                            Member User Profile let them use their
                            created/issued User Account to access their
                            information in the system. Below is the connected
                            User Account for this member profile.
                        </p>
                        <UserAccountCardMini user={memberProfile.user} />
                        <p className="my-4 rounded-md text-xs text-muted-foreground/60">
                            If the member wants a new account, you can
                            disconnect this account first.
                        </p>
                        <Button
                            variant="secondary"
                            hoverVariant="destructive"
                            disabled={isDisconnecting}
                            onClick={() => {
                                onOpenSecurityAction({
                                    title: 'Disconnect User Account',
                                    onSuccess: () =>
                                        disconnect(memberProfile.id),
                                })
                            }}
                        >
                            {isDisconnecting ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <UnlinkIcon className="mr-1" />
                                    Disconnect Account
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            This member does not have a user account for logging
                            in. To enable login access, create a new user
                            account or connect an existing one.
                        </p>
                        <fieldset
                            disabled={isConnecting}
                            className="flex gap-x-2"
                        >
                            <MemberUserAccountCreateUpdateFormModal
                                {...createUserModal}
                                formProps={{
                                    memberProfileId: memberProfile.id,
                                    defaultValues: {
                                        birthdate: memberProfile.birthdate,
                                        contact_number:
                                            memberProfile.contact_number,
                                        first_name: memberProfile.first_name,
                                        middle_name: memberProfile.middle_name,
                                        last_name: memberProfile.full_name,
                                        suffix: memberProfile.suffix,
                                        full_name: memberProfile.full_name,
                                        user_name: memberProfile.first_name,
                                    },
                                }}
                            />
                            <UserOrganizationPicker
                                triggerClassName="hidden"
                                modalState={connectUserModal}
                                userOrgSearchMode="none-member-profile"
                                onSelect={(value) => {
                                    const userOrg =
                                        value as unknown as IUserOrganization<IMember>

                                    onOpen({
                                        title: (
                                            <p className="flex items-center truncate">
                                                <span className="mr-2 inline-flex items-center justify-center rounded-md bg-accent p-1">
                                                    <LinkIcon className="text-primary" />
                                                </span>
                                                Connect Member Profile User
                                                Account
                                            </p>
                                        ),
                                        description:
                                            "You're about to connect a member profile to a user account. This action will link these profiles together permanently.",
                                        confirmString: (
                                            <p>
                                                <LinkIcon className="mr-2 inline" />
                                                Connect
                                            </p>
                                        ),
                                        content: (
                                            <ProfileConnectUserModalDisplay
                                                userOrg={userOrg}
                                                memberProfile={memberProfile}
                                            />
                                        ),
                                        onConfirm: () =>
                                            connect({
                                                memberProfileId:
                                                    memberProfile.id,
                                                userId: userOrg.user_id,
                                            }),
                                    })
                                }}
                            />

                            <Button
                                variant="outline"
                                onClick={() =>
                                    createUserModal.onOpenChange(true)
                                }
                                className="group !h-auto w-1/2 flex-col items-start space-y-2 rounded-xl from-primary/40 to-transparent to-80% py-4 hover:bg-gradient-to-tr"
                            >
                                <div className="flex w-full items-center justify-between">
                                    <p className="shrink truncate">
                                        Create New User Profile
                                    </p>
                                    <UserPlusIcon className="size-4 shrink-0 text-muted-foreground/60 duration-200 ease-out group-hover:text-primary" />
                                </div>
                                <p className="text-wrap text-left text-xs text-muted-foreground/90">
                                    Create a new user profile for this member
                                    profile.
                                </p>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    connectUserModal.onOpenChange(true)
                                }
                                className={cn(
                                    'group !h-auto w-1/2 flex-col items-start space-y-2 rounded-xl from-primary/40 to-transparent to-80% py-4 hover:bg-gradient-to-tr',
                                    isConnecting && 'bg-gradient-to-tr'
                                )}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <p className="shrink truncate">
                                        Connect to existing User Profile
                                    </p>
                                    {!isConnecting ? (
                                        <PlugConnectFillIcon className="size-4 shrink-0 text-muted-foreground/60 duration-200 ease-out group-hover:text-primary" />
                                    ) : (
                                        <LoadingSpinner className="inline" />
                                    )}
                                </div>
                                <p
                                    className={cn(
                                        'text-wrap text-left text-xs text-muted-foreground/80',
                                        isConnecting && 'animate-pulse'
                                    )}
                                >
                                    {isConnecting
                                        ? 'Connecting...'
                                        : 'Connect this Profile to an existing User Profile that has no profile yet.'}
                                </p>
                            </Button>
                        </fieldset>
                    </div>
                )}
            </div>
        )
    }
)

MemberUserAccount.displayName = 'MembershipInfo'

export default MemberUserAccount
