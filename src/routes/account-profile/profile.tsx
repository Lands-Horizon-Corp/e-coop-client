import { createFileRoute } from '@tanstack/react-router'

import { IUserBase } from '@/modules/user'
import AccountProfileForm from '@/modules/user-profile/components/forms/account-profile-form'
import { useAuthUser } from '@/store/user-auth-store'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute('/account-profile/profile')({
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
