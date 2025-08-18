import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { useAuthStore } from '@/store/user-auth-store'
import { useRouter, useSearch } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

import SignInForm from '@/components/forms/auth-forms/sign-in-form'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import GuestGuard from '@/components/wrappers/guest-guard'

import { IAuthContext } from '@/types'

import AuthPageWrapper from './-components/auth-page-wrapper'

export const Route = createFileRoute('/auth/sign-in')({
    component: SignInPage,
})

function SignInPage() {
    const router = useRouter()
    const { cbUrl } = useSearch({ from: '/auth' })
    const queryClient = useQueryClient()

    const { authStatus, currentAuth, setCurrentAuth } = useAuthStore()

    const prefilledValues = useSearch({ from: '/auth/sign-in' })

    const onSignInSuccess = useCallback(
        (userData: IAuthContext) => {
            setCurrentAuth(userData)
            queryClient.setQueryData(['current-user'], userData)

            if (cbUrl?.startsWith('/org') && !userData.user_organization) {
                router.navigate({ to: '/onboarding', search: { cbUrl } })
            }

            router.navigate({ to: cbUrl as string })
        },
        [cbUrl, queryClient, router, setCurrentAuth]
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
