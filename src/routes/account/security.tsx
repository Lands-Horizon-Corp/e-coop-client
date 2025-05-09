import { createFileRoute } from '@tanstack/react-router'

import AccountSecurityForm from '@/components/forms/user-account-settings-forms/account-security-form'

export const Route = createFileRoute('/account/security')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            <AccountSecurityForm />
        </div>
    )
}
