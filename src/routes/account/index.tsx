import { createFileRoute } from '@tanstack/react-router'

import AccountGeneralForm from '@/components/forms/user-account-settings-forms/account-general-form'
import { useAuthUser } from '@/store/user-auth-store'

export const Route = createFileRoute('/account/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
    } = useAuthUser()

    return (
        <div>
            <AccountGeneralForm defaultValues={user} />
        </div>
    )
}
