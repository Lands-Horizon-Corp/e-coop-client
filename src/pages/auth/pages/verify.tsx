import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'

import VerifyRoot from '@/pages/auth/components/verify-root'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import AuthPageWrapper from '@/pages/auth/components/auth-page-wrapper'
import ShowAccountStatus from '../components/verify-root/show-account-status'

import { useSignOut } from '@/hooks/api-hooks/use-auth'
import { useUserAuthStore } from '@/store/user-auth-store'
import { isUserHasUnverified, getUsersAccountTypeRedirectPage } from '@/helpers'

const Verify = () => {
    const router = useRouter()
    const { currentUser, setCurrentUser, authStatus } = useUserAuthStore()

    const { mutate: onBackSignOut, isPending: isSigningOut } = useSignOut({
        onSuccess: () => {
            setCurrentUser(null)
            router.navigate({ to: '/auth' })
        },
    })

    const [display, setDisplay] = useState<null | 'verify' | 'account-status'>(
        null
    )

    useEffect(() => {
        if (
            !currentUser ||
            ['loading', 'error', 'unauthorized'].includes(authStatus)
        )
            return
        else if (
            isUserHasUnverified(currentUser) &&
            !currentUser.isSkipVerification
        ) {
            setDisplay('verify')
        } else if (
            currentUser.status === 'Verified' &&
            !isUserHasUnverified(currentUser)
        ) {
            const redirectUrl = getUsersAccountTypeRedirectPage(currentUser)
            router.navigate({ to: redirectUrl })
        } else {
            setDisplay('account-status')
        }
    }, [authStatus, currentUser, router])

    return (
        <div className="flex min-h-full flex-col items-center justify-center">
            <AuthPageWrapper>
                {authStatus === 'loading' && (
                    <div className="flex flex-col items-center gap-y-2">
                        <LoadingSpinner className="block" />
                        <p className="text-center text-sm text-foreground/50">
                            loading user info
                        </p>
                    </div>
                )}
                {authStatus === 'authorized' && currentUser && (
                    <>
                        {display === 'verify' && (
                            <VerifyRoot
                                userData={currentUser}
                                onSkip={() => setDisplay('account-status')}
                                onVerifyChange={(newUserData) =>
                                    setCurrentUser(newUserData)
                                }
                                onVerifyComplete={(newUserData) => {
                                    setDisplay('account-status')
                                    setCurrentUser(newUserData)
                                }}
                            />
                        )}
                        {display === 'account-status' && (
                            <ShowAccountStatus
                                loading={isSigningOut}
                                onBackSignOut={onBackSignOut}
                                userData={currentUser}
                            />
                        )}
                    </>
                )}
                {['unauthorized', 'error'].includes(authStatus) && (
                    <p>
                        Couldn&apos;t load your profile info, please please try
                        again
                    </p>
                )}
            </AuthPageWrapper>
        </div>
    )
}

export default Verify
