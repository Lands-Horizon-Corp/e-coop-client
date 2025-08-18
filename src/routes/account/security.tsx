import { createFileRoute } from '@tanstack/react-router'

import DevicesList from '@/components/auth/devices-list'
import AccountSecurityForm from '@/components/forms/user-account-settings-forms/account-security-form'

import { useCurrentLoggedInUser } from '@/hooks/api-hooks/use-auth'

export const Route = createFileRoute('/account/security')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: users } = useCurrentLoggedInUser({})
    return (
        <div>
            <DevicesList devices={users ?? []} />
            <AccountSecurityForm />
        </div>
    )
}
