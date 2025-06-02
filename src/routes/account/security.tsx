import { createFileRoute } from '@tanstack/react-router'

import AccountSecurityForm from '@/components/forms/user-account-settings-forms/account-security-form'

import { useCurrentLoggedInUser } from '@/hooks/api-hooks/use-auth'
import DevicesList from '@/components/auth/devices-list'

export const Route = createFileRoute('/account/security')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: users } = useCurrentLoggedInUser({})
    return (
        <div>
            <DevicesList devices={users ?? []}/>
            <AccountSecurityForm />
        </div>
    )
}
