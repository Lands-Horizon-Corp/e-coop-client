import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAuthStore } from '@/modules/authentication/authgentication.store'
import DevicesList from '@/modules/authentication/components/devices-list'
import AccountSecurityForm from '@/modules/user-profile/components/forms/account-security-form'
import AccountProfileInactivity from '@/modules/user-profile/components/forms/account.inactivity'

import { ShieldLockIcon } from '@/components/icons'

export const Route = createFileRoute('/account-profile/security')({
    component: RouteComponent,
})

function RouteComponent() {
    const { resetAuth } = useAuthStore()

    return (
        <div className="space-y-4 max-w-4xl mx-auto ">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldLockIcon className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Account Security
                </h1>
            </div>
            <AccountSecurityForm
                className="bg-accent/40 dark:bg-popover/20 p-4 rounded-3xl"
                onSuccess={() => {
                    resetAuth()
                    toast.info('Please Sign in again.')
                }}
            />
            <AccountProfileInactivity />
            <DevicesList />
        </div>
    )
}
