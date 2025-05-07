import { useRouter } from '@tanstack/react-router'

import { useAuthStore } from '@/store/user-auth-store'
import GuestGuard from '@/components/wrappers/guest-guard'
import { SignUpForm } from '@/components/forms/auth-forms'
import AuthPageWrapper from './-components/auth-page-wrapper'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/sign-up')({
    component: SignUpPage,
})

function SignUpPage() {
    const router = useRouter()
    const { setCurrentAuth } = useAuthStore()

    return (
        <GuestGuard>
            <div className="flex min-h-full flex-col items-center justify-center">
                <AuthPageWrapper>
                    <SignUpForm
                        className="max-w-5xl"
                        onSuccess={(authContext) => {
                            setCurrentAuth(authContext)
                            router.navigate({ to: '/onboarding' as string })
                        }}
                    />
                </AuthPageWrapper>
            </div>
        </GuestGuard>
    )
}
