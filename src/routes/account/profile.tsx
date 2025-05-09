import AccountProfileForm from '@/components/forms/user-account-settings-forms/account-profile-form'
import { useAuthUser } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/profile')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
    } = useAuthUser()

    return (
        <div>
            <AccountProfileForm defaultValues={user} />
        </div>
    )
}
