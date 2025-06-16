import { ReactNode } from 'react'
import { Navigate, useRouter } from '@tanstack/react-router'

import {
    RefreshIcon,
    ArrowRightIcon,
    ShieldExclamationIcon,
    BadgeExclamationFillIcon,
} from '@/components/icons'
import ImageDisplay from '../image-display'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/user-avatar'
import { FlickeringGrid } from '../elements/backgrounds/flickering-grid'

import { useAuthStore } from '@/store/user-auth-store'

import LOADING_ARTWORK_GIF from '@/assets/gifs/e-coop-artwork-loading.gif'

import { IBaseProps, TPageType, IUserBase } from '@/types'

interface Props extends IBaseProps {
    pageType?: TPageType
    allowNoRole?: boolean
}

const AuthGuard = ({ children, pageType = 'AUTHENTICATED' }: Props) => {
    const router = useRouter()
    const { currentAuth, authStatus } = useAuthStore()

    if (pageType === 'AUTHENTICATED') {
        if (authStatus === 'loading')
            return (
                <div className="relative flex h-screen w-full flex-col items-center justify-center">
                    <ImageDisplay
                        src={LOADING_ARTWORK_GIF}
                        className="block size-48 rounded-none !bg-transparent"
                        fallbackClassName="!bg-transparent rounded-none"
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
                            variant="secondary"
                            hoverVariant="primary"
                            className="gap-x-2 rounded-full"
                            onClick={() => location.reload()}
                        >
                            <RefreshIcon />
                            Refresh
                        </Button>
                        <Button
                            variant="secondary"
                            hoverVariant="primary"
                            className="gap-x-2 rounded-full"
                            onClick={() =>
                                router.navigate({ to: '/auth' as string })
                            }
                        >
                            <ArrowRightIcon className="-rotate-45" />
                            Go to Sign In
                        </Button>
                    </div>
                    <FlickeringGrid
                        gridGap={1}
                        squareSize={64}
                        color="#02BEAA"
                        maxOpacity={0.5}
                        flickerChance={0.05}
                        className="absolute inset-0 z-0 opacity-80 [mask-image:radial-gradient(80vh_circle_at_center,white,transparent)] dark:opacity-20"
                    />
                </div>
            )

        if (!currentAuth.user)
            return <Navigate to={'/auth/sign-in' as string} />

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

export default AuthGuard
