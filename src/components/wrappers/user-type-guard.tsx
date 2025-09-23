import { ReactNode } from 'react'

import { Navigate, useRouter } from '@tanstack/react-router'

import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { IUserBase, TUserType } from '@/modules/user'
import UserAvatar from '@/modules/user/components/user-avatar'

import { BadgeExclamationFillIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { IBaseProps } from '@/types'

interface Props extends IBaseProps {
    allowNoUserType?: boolean
    allowedUserTypes?: TUserType[]
}

const UserTypeGuard = ({
    children,
    allowedUserTypes = [],
    allowNoUserType = false,
}: Props) => {
    const router = useRouter()
    const { currentAuth, authStatus } = useAuthStore()

    if (authStatus === 'loading')
        return (
            <div className="relative flex h-screen w-full items-center justify-center">
                <LoadingSpinner />
            </div>
        )

    if (authStatus === 'unauthorized' || !currentAuth.user)
        return <Navigate to={'/auth/sign-in' as string} />

    if (authStatus === 'error' && !currentAuth.user)
        return (
            <div className="relative flex h-screen w-full items-center justify-center">
                <p>
                    Sorry, There&apos;s an unexpected problem, try refreshing
                    the page.
                </p>
            </div>
        )

    if (currentAuth.user.type === 'ban') {
        return (
            <BannerContainer>
                <AccountInfoContent
                    currentUser={currentAuth.user}
                    infoTitle="Not Allowed"
                    infoDescription="It looks like your account has been banned. If you think this is a mistake, please talk your cooperative admin/staff for assistance."
                />
                <Button
                    className="rounded-full"
                    onClick={() => router.history.back()}
                >
                    Go Back
                </Button>
            </BannerContainer>
        )
    }

    if (
        (allowNoUserType && !currentAuth.user.type) ||
        !allowedUserTypes.includes(
            currentAuth.user.type ?? ('' as unknown as TUserType)
        )
    ) {
        return (
            <BannerContainer>
                <AccountInfoContent
                    currentUser={currentAuth.user}
                    infoTitle="Not Allowed"
                    infoDescription="It looks like your account is not allowed on this page."
                />
                <Button
                    className="rounded-full"
                    onClick={() => router.history.back()}
                >
                    Go Back
                </Button>
            </BannerContainer>
        )
    }

    return children
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
    currentUser: IUserBase
}) => {
    return (
        <>
            <UserAvatar
                src={currentUser.media?.download_url ?? ''}
                fallback={currentUser.user_name.charAt(0) ?? '-'}
                className="size-36 border-4 text-2xl font-medium"
            />
            {currentUser.type === 'ban' && (
                <BadgeExclamationFillIcon className="size-8 text-rose-400" />
            )}
            <p className="text-xl font-medium">{infoTitle}</p>
            <p className="max-w-xl text-center text-foreground/80">
                {infoDescription}
            </p>
        </>
    )
}

export default UserTypeGuard
