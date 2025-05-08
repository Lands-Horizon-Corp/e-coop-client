import VerifyForm from '@/components/forms/auth-forms/verify-form'
import { useAuthUser } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/verify/email')({
    component: RouteComponent,
})

function RouteComponent() {
    const { updateCurrentAuth } = useAuthUser()

    return (
        <div>
            <VerifyForm
                verifyMode="mobile"
                onSuccess={(data) => updateCurrentAuth({ user: data })}
            />
        </div>
    )
}
