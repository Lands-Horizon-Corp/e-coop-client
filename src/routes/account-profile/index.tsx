import { createFileRoute } from '@tanstack/react-router'

import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { IUserBase } from '@/modules/user'
import AccountProfilePicture from '@/modules/user-profile/components/account-profile-picture'
import AccountGeneralForm from '@/modules/user-profile/components/forms/account-general-form'
import { AccountProfileFormModal } from '@/modules/user-profile/components/forms/account-profile-form'

import { EmailIcon, PencilFillIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute('/account-profile/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
        updateCurrentAuth,
    } = useAuthUser()
    const editProfileState = useModalState()

    useSubscribe<IUserBase>(`user.update.${user.id}`, (newUserData) => {
        updateCurrentAuth({ user: newUserData })
    })

    return (
        <div className="space-y-4 max-w-4xl rounded-3xl mx-auto p-4">
            <div className="bg-[url('/profile-cover-light.png')] dark:bg-[url('profile-cover-dark.png')] bg-no-repeat bg-cover rounded-3xl h-48"></div>
            <div className="relative flex justify-between">
                <span className="absolute -top-16 left-4">
                    <AccountProfilePicture className="size-32" user={user} />
                </span>
                <div className="ml-40">
                    <span>{user.full_name}</span>
                    <span className="block text-sm text-muted-foreground/60">
                        <EmailIcon className="inline" /> {user.email}
                    </span>
                    <span className="text-xs flex items-center text-muted-foreground/60">
                        <div className="inline-block rounded-full mr-1 animate-pulse bg-primary size-1.5" />{' '}
                        {toReadableDate(user.created_at)} -{' '}
                        {dateAgo(user.created_at)}
                    </span>
                </div>
                <Button onClick={() => editProfileState.onOpenChange(true)}>
                    <PencilFillIcon /> Edit Personal Details
                </Button>
            </div>
            <AccountProfileFormModal
                {...editProfileState}
                formProps={{
                    defaultValues: user,
                    onSuccess(data) {
                        updateCurrentAuth({ user: data })
                    },
                }}
            />
            <AccountGeneralForm
                className="mt-8 bg-accent/40 dark:bg-popover/20 p-4 rounded-xl"
                defaultValues={user}
            />
        </div>
    )
}
