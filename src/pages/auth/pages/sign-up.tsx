import { useRouter } from '@tanstack/react-router'

import GuestGuard from '@/components/wrappers/guest-guard'
import { SignUpForm } from '@/components/forms/auth-forms'
import { useUserAuthStore } from '@/store/user-auth-store'
import AuthPageWrapper from '../components/auth-page-wrapper'

const SignUpPage = () => {
    const router = useRouter()
    const { setCurrentUser } = useUserAuthStore()

    return (
        <GuestGuard>
            <div className="flex min-h-full flex-col items-center justify-center">
                <AuthPageWrapper>
                    <SignUpForm
                        onSuccess={(userData) => {
                            setCurrentUser(userData)
                            router.navigate({ to: '/auth/verify' })
                        }}
                    />
                </AuthPageWrapper>
            </div>
        </GuestGuard>
    )
}

export default SignUpPage
