import { ReactNode, useCallback, useRef } from 'react'

import { Navigate, useLocation, useRouter } from '@tanstack/react-router'
import { AxiosError } from 'axios'

import LOADING_ARTWORK_GIF from '@/assets/gifs/e-coop-artwork-loading.gif'
import { IAuthContext, useAuthContext } from '@/modules/authentication'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { IUserBase } from '@/modules/user'
import UserAvatar from '@/modules/user/components/user-avatar'

import {
    ArrowRightIcon,
    BadgeExclamationFillIcon,
    RefreshIcon,
    ShieldExclamationIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { IBaseProps, TPageType } from '@/types'

import { FlickeringGrid } from '../backgrounds/flickering-grid'
import ImageMatch from '../image-match'

interface Props extends IBaseProps {
    pageType?: TPageType
    allowNoRole?: boolean
}

const AuthGuard = ({ children, pageType = 'AUTHENTICATED' }: Props) => {
    const router = useRouter()
    const { pathname } = useLocation()
    const {
        currentAuth,
        authStatus,
        updateCurrentAuth,
        setAuthStatus,
        resetAuth,
    } = useAuthStore()

    const { refetch, data, error, isError, isSuccess } = useAuthContext({
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
        },
    })

    const handleSuccess = useCallback(
        (data: IAuthContext) => {
            updateCurrentAuth(data)
            setAuthStatus('authorized')
        },
        [updateCurrentAuth, setAuthStatus]
    )

    const handleError = useCallback(
        (rawError: Error) => {
            if (rawError instanceof AxiosError && rawError.status === 401) {
                resetAuth()
                setAuthStatus('unauthorized')
                return null
            }

            if (rawError instanceof AxiosError && rawError.status === 500) {
                setAuthStatus('error')
                return null
            }

            setAuthStatus('error')
        },
        [resetAuth, setAuthStatus]
    )

    useQeueryHookCallback({
        data,
        error,
        isError,
        isSuccess,
        onSuccess: handleSuccess,
        onError: handleError,
    })

    useSubscribe(
        `user_organization.update.${currentAuth.user_organization?.id}`,
        refetch
    )

    useSubscribe(
        `branch.update.${currentAuth.user_organization?.branch_id}`,
        refetch
    )

    const originalPathnameRef = useRef<string | null>(null)

    if (originalPathnameRef.current === null && !pathname.startsWith('/auth')) {
        originalPathnameRef.current = pathname
    }

    const callbackUrl = originalPathnameRef.current || '/onboarding'

    if (pageType === 'AUTHENTICATED') {
        if (authStatus === 'loading')
            return (
                <div className="relative flex h-screen w-full flex-col items-center justify-center">
                    <ImageMatch
                        alt={'loading-gif'}
                        className="block size-48 rounded-none !bg-transparent"
                        src={LOADING_ARTWORK_GIF}
                    />
                    <p className="mt-4 animate-pulse text-sm text-muted-foreground drop-shadow-lg">
                        {/* <LoadingSpinner className="mr-2 inline size-3" /> */}
                        loading authentication info
                    </p>
                </div>
            )

        if (authStatus === 'error' && !currentAuth.user)
            return (
                <div className="relative flex h-screen w-full flex-col items-center justify-center gap-y-4 text-muted-foreground">
                    <ShieldExclamationIcon className="z-10 size-16" />
                    <p className="z-10">
                        Sorry we cannot load your authorization, try refreshing
                        the page. If the error persist try again later.
                    </p>
                    <div className="z-10 flex items-center gap-x-2">
                        <Button
                            className="gap-x-2 rounded-full"
                            hoverVariant="primary"
                            onClick={() => location.reload()}
                            variant="secondary"
                        >
                            <RefreshIcon />
                            Refresh
                        </Button>
                        <Button
                            className="gap-x-2 rounded-full"
                            hoverVariant="primary"
                            onClick={() =>
                                router.navigate({ to: '/auth' as string })
                            }
                            variant="secondary"
                        >
                            <ArrowRightIcon className="-rotate-45" />
                            Go to Sign In
                        </Button>
                    </div>
                    <FlickeringGrid
                        flickerChance={0.05}
                        gridGap={1}
                        maxOpacity={0.5}
                        squareSize={64}
                    />
                </div>
            )

        if (!currentAuth.user || authStatus === 'unauthorized')
            return (
                <Navigate
                    ignoreBlocker
                    search={{
                        cbUrl: callbackUrl,
                    }}
                    to={'/auth/sign-in' as string}
                />
            )

        if (currentAuth.user.type === 'ban') {
            return (
                <BannerContainer>
                    <AccountInfoContent
                        currentUser={currentAuth.user}
                        infoDescription="It looks like your account has been banned. If you think this is a mistake, please talk your cooperative admin/staff for assistance."
                        infoTitle="Not Allowed"
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
                className="size-36 border-4 text-2xl font-medium"
                fallback={currentUser.user_name.charAt(0) ?? '-'}
                src={currentUser.media?.download_url ?? ''}
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

export default AuthGuard
