import { createFileRoute } from '@tanstack/react-router'

import AccountProfileForm from '@/components/forms/user-account-settings-forms/account-profile-form'

import { IUserBase } from '@/types'
import { useSubscribe } from '@/hooks/use-pubsub'
import { useAuthUser } from '@/store/user-auth-store'

export const Route = createFileRoute('/account/profile')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
        updateCurrentAuth,
    } = useAuthUser()

    useSubscribe<IUserBase>(`user.update.${user.id}`, (newUserData) => {
        updateCurrentAuth({ user: newUserData })
    })

    return (
        <div>
            <AccountProfileForm defaultValues={user} />
        </div>
    )
}
