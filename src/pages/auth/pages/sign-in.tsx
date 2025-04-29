import { toast } from 'sonner'
import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearch } from '@tanstack/react-router'

import GuestGuard from '@/components/wrappers/guest-guard'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import SignInForm from '@/components/forms/auth-forms/sign-in-form'
import AuthPageWrapper from '../components/auth-page-wrapper'

import { IUserData } from '@/types'
import { isUserHasUnverified } from '@/helpers'
import { useUserAuthStore } from '@/store/user-auth-store'

const SignInPage = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const { currentUser, authStatus, setCurrentUser } = useUserAuthStore()

    const prefilledValues = useSearch({ from: '/auth/sign-in' })

    const onSignInSuccess = useCallback(
        (userData: IUserData) => {
            setCurrentUser(userData)

            const { status } = userData

            queryClient.setQueryData(['current-user'], userData)

            if (status === 'Not Allowed') {
                toast.error(
                    'Your account has been canceled, and you can no longer log in.'
                )
                router.navigate({ to: '/auth/verify' })
                return
            }

            if (!userData.isSkipVerification && isUserHasUnverified(userData)) {
                toast.warning('Your account is pending approval')
                router.navigate({ to: '/auth/verify' })
                return
            }
        },
        [queryClient, router, setCurrentUser]
    )

    useEffect(() => {
        if (!currentUser) return
        onSignInSuccess(currentUser)
    }, [currentUser, onSignInSuccess])

    return (
        <GuestGuard>
            <div className="flex min-h-full flex-col items-center justify-center">
                <AuthPageWrapper>
                    {!currentUser && (
                        <SignInForm
                            defaultValues={prefilledValues}
                            onSuccess={onSignInSuccess}
                        />
                    )}
                    {currentUser && <LoadingSpinner />}
                    {authStatus === 'loading' && <LoadingSpinner />}
                </AuthPageWrapper>
            </div>
        </GuestGuard>
    )
}

export default SignInPage
