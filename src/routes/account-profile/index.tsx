import { createFileRoute } from '@tanstack/react-router'

import { IUserBase } from '@/modules/user'
import AccountProfilePicture from '@/modules/user-profile/components/account-profile-picture'
import AccountGeneralForm from '@/modules/user-profile/components/forms/account-general-form'
import { useAuthUser } from '@/store/user-auth-store'

import { Label } from '@/components/ui/label'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute('/account-profile/')({
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
        <div className="space-y-4">
            <div>
                <Label>Profile Photo</Label>
                <AccountProfilePicture user={user} />
            </div>
            <AccountGeneralForm defaultValues={user} />
        </div>
    )
}
