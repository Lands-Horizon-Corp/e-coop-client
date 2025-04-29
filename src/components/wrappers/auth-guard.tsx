import { ReactNode } from 'react'
import { Navigate, useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/user-avatar'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import {
    BadgeMinusFillIcon,
    BadgeCheckFillIcon,
    BadgeExclamationFillIcon,
} from '@/components/icons'

import { cn } from '@/lib'
import { IUserData } from '@/types'
import { IBaseProps, TPageType } from '@/types'
import { TAccountType } from '@/types'
import { useUserAuthStore } from '@/store/user-auth-store'
import { isUserHasUnverified, isUserUnverified } from '@/helpers'

interface Props extends IBaseProps {
    pageType?: TPageType
    allowedAccountTypes?: TAccountType[]
}

const AuthGuard = ({
    children,
    allowedAccountTypes = [],
    pageType = 'AUTHENTICATED',
}: Props) => {
    const router = useRouter()
    const { currentUser, authStatus } = useUserAuthStore()

    if (pageType === 'AUTHENTICATED') {
        if (authStatus === 'loading')
            return (
                <div className="relative flex h-screen w-full items-center justify-center">
                    <LoadingSpinner />
                </div>
            )

        if (authStatus === 'error' && !currentUser)
            return (
                <div className="relative flex h-screen w-full items-center justify-center">
                    <p>
                        Sorry, There&apos;s an unexpected problem, try
                        refreshing the page.
                    </p>
                </div>
            )

        if (!currentUser) return <Navigate to={'/auth/sign-in' as string} />

        if (
            !currentUser.isSkipVerification &&
            currentUser.status !== 'Not Allowed' &&
            isUserHasUnverified(currentUser)
        ) {
            return (
                <BannerContainer>
                    <AccountInfoContent
                        currentUser={currentUser}
                        infoTitle="Verification Required"
                        infoDescription="It looks like you have unverified contacts or your account status is still pending. For security reasons, please verify your contact information to access all features."
                    />
                    <Button
                        className="rounded-full"
                        onClick={() =>
                            router.navigate({ to: '/auth/verify' as string })
                        }
                    >
                        Verify Now
                    </Button>
                </BannerContainer>
            )
        }

        if (
            (currentUser &&
                !allowedAccountTypes.includes(currentUser?.accountType)) ||
            isUserUnverified(currentUser)
        )
            return (
                <BannerContainer>
                    <AccountInfoContent
                        infoTitle="Restricted"
                        currentUser={currentUser}
                        infoDescription="Sorry but your account type is restricted in accessing
                        this page"
                    />
                    <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => router.history.back()}
                    >
                        Go Back
                    </Button>
                </BannerContainer>
            )
    }

    return <>{children}</>
}

const BannerContainer = ({ children }: { children?: ReactNode }) => {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4">
            {children}
        </div>
    )
}

const AccountInfoContent = ({
    infoTitle,
    infoDescription,
    currentUser,
}: {
    infoTitle: string
    infoDescription: string
    currentUser: IUserData
}) => {
    return (
        <>
            <UserAvatar
                src={currentUser.media?.downloadURL ?? ''}
                fallback={currentUser.username.charAt(0) ?? '-'}
                className="size-36 border-4 text-2xl font-medium"
            />
            {currentUser.status === 'Pending' && (
                <BadgeMinusFillIcon className="size-8 text-amber-500" />
            )}
            {currentUser.status === 'Verified' && (
                <BadgeCheckFillIcon
                    className={cn(
                        'size-8 text-primary',
                        isUserHasUnverified(currentUser) && 'text-amber-500'
                    )}
                />
            )}
            {currentUser.status === 'Not Allowed' && (
                <BadgeExclamationFillIcon className="size-8 text-rose-400" />
            )}
            <p className="text-xl font-medium">{infoTitle}</p>
            <p className="max-w-xl text-center text-foreground/80">
                {infoDescription}
            </p>
        </>
    )
}

export default AuthGuard
