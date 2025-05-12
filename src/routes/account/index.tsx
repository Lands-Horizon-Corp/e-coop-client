import { createFileRoute } from '@tanstack/react-router'

import { Label } from '@/components/ui/label'
import AccountProfilePicture from '@/components/account-settings/account-profile-picture'
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
        <div className="space-y-4">
            <div>
                <Label>Profile Photo</Label>
                <AccountProfilePicture user={user} />
            </div>
            <AccountGeneralForm defaultValues={user} />
        </div>
    )
}
