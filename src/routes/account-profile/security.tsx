import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useCurrentLoggedInUser } from '@/modules/authentication'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import DevicesList from '@/modules/authentication/components/devices-list'
import AccountSecurityForm from '@/modules/user-profile/components/forms/account-security-form'

export const Route = createFileRoute('/account-profile/security')({
    component: RouteComponent,
})

function RouteComponent() {
    const { resetAuth } = useAuthStore()
    const { data: users } = useCurrentLoggedInUser({})

    return (
        <div>
            <DevicesList devices={users ?? []} />
            <AccountSecurityForm
                onSuccess={() => {
                    resetAuth()
                    toast.info('Please Sign in again.')
                }}
            />
        </div>
    )
}
