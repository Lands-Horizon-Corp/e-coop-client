import { useCallback } from 'react'
import { useSearch } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'

import GuestGuard from '@/components/wrappers/guest-guard'
import AuthPageWrapper from './-components/auth-page-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import SignInForm from '@/components/forms/auth-forms/sign-in-form'

import { IAuthContext } from '@/types'
import { useAuthStore } from '@/store/user-auth-store'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/sign-in')({
    component: SignInPage,
})

function SignInPage() {
    const queryClient = useQueryClient()

    const { authStatus, currentAuth, setCurrentAuth } = useAuthStore()

    const prefilledValues = useSearch({ from: '/auth/sign-in' })

    const onSignInSuccess = useCallback(
        (userData: IAuthContext) => {
            setCurrentAuth(userData)
            queryClient.setQueryData(['current-user'], userData)
        },
        [queryClient, setCurrentAuth]
    )

    return (
        <GuestGuard>
            <div className="flex min-h-full w-full flex-col items-center justify-center">
                <AuthPageWrapper>
                    {authStatus !== 'authorized' && (
                        <SignInForm
                            className="w-full max-w-lg"
                            onSuccess={onSignInSuccess}
                            defaultValues={prefilledValues}
                        />
                    )}
                    {(authStatus === 'loading' || currentAuth.user) && (
                        <LoadingSpinner />
                    )}
                </AuthPageWrapper>
            </div>
        </GuestGuard>
    )
}
