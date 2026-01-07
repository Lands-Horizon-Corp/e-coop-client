import { useCallback } from 'react'

import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { NATS_PASS, NATS_USER } from '@/constants'
import { IAuthContext, useAuthContext } from '@/modules/authentication'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import UserProfileInactivityPrompter from '@/modules/user-profile/components/user-profile-inactivity-prompter'
import { ActionSecurityProvider } from '@/providers/action-security-provider'
import ConnectionProvider from '@/providers/connection-provider'

import CookieConsent from '@/components/cookie-consent'
import {
    CheckFillIcon,
    InfoFillCircleIcon,
    NotAllowedIcon,
    WarningFillIcon,
} from '@/components/icons'
import ImagePreviewModal from '@/components/image-preview/image-preview-modal'
import ConfirmModal from '@/components/modals/confirm-modal'
import InfoModal from '@/components/modals/info-modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Toaster } from '@/components/ui/sonner'

import { useNatsConnect } from '@/hooks/use-pubsub'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import ErrorPage from './-common-pages/error-page'
import NotFoundPage from './-common-pages/not-found-page'

export const Route = createRootRoute({
    component: RootLayout,
    errorComponent: ErrorPage,
    notFoundComponent: NotFoundPage,
})

function RootLayout() {
    const { setAuthStatus, setCurrentAuth, resetAuth } = useAuthStore()

    const { error, isError, data, isSuccess } = useAuthContext({
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
        },
    })

    const handleSuccess = useCallback(
        (authorizationContext: IAuthContext) => {
            setCurrentAuth(authorizationContext)
            setAuthStatus('authorized')
        },
        [setAuthStatus, setCurrentAuth]
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

    useNatsConnect({ user: NATS_USER, pass: NATS_PASS })

    return (
        <div className="relative">
            <DndProvider backend={HTML5Backend}>
                <Toaster
                    className="z-[9999] toaster group"
                    closeButton
                    icons={{
                        success: (
                            <span className="bg-green-300/20 rounded-full animate-pulse flex items-center justify-center p-1">
                                <CheckFillIcon className="text-green-400 size-4 inline" />
                            </span>
                        ),

                        info: (
                            <span className="bg-blue-300/20 rounded-full animate-pulse flex items-center justify-center p-1">
                                <InfoFillCircleIcon className="text-blue-400 size-4 inline" />
                            </span>
                        ),
                        loading: <LoadingSpinner />,
                        error: (
                            <span className="bg-rose-300/20 rounded-full animate-pulse flex items-center justify-center p-1">
                                <NotAllowedIcon className="text-rose-400 size-4 inline" />
                            </span>
                        ),

                        warning: (
                            <span className="bg-[#e8915f]/20 rounded-full animate-pulse flex items-center justify-center p-1">
                                <WarningFillIcon className="text-[#e8915f] size-4 inline" />
                            </span>
                        ),
                    }}
                    richColors
                    theme="system"
                    toastOptions={{
                        classNames: {
                            icon: 'flex items-center justify-center !mr-2',

                            success:
                                '!p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 ' +
                                '!bg-green-50 dark:!bg-transparent dark:!bg-gradient-to-tr ' +
                                '!border-b-primary !border-primary ' +
                                'dark:!from-primary dark:!to-background ' +
                                '!text-foreground',

                            info:
                                '!p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 ' +
                                '!bg-blue-50 dark:!bg-transparent dark:!bg-gradient-to-tr ' +
                                '!border-b-primary !border-primary ' +
                                'dark:!from-primary/70 dark:!to-background ' +
                                '!text-foreground',

                            loading:
                                '!p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 ' +
                                '!bg-primary/10 dark:!bg-transparent dark:!bg-gradient-to-tr ' +
                                '!border-b-primary !border-primary ' +
                                'dark:!from-primary/40 dark:!to-background ' +
                                '!text-foreground',

                            error:
                                '!p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 ' +
                                '!bg-rose-50 dark:!bg-transparent dark:!bg-gradient-to-tr ' +
                                '!border-b-destructive !border-destructive ' +
                                'dark:!from-destructive dark:!to-background ' +
                                '!text-foreground',

                            warning:
                                '!p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 ' +
                                '!bg-[#e8915f]/10 dark:!bg-transparent dark:!bg-gradient-to-tr ' +
                                '!border-b-warning !border-warning ' +
                                'dark:!from-warning dark:!to-popover ' +
                                '!text-foreground',
                        },
                    }}
                />
                <Outlet />
                <ConnectionProvider />
                <CookieConsent />
                <ImagePreviewModal />
                <ConfirmModal />
                <InfoModal />

                <UserProfileInactivityPrompter />
                <ActionSecurityProvider />
                {/* <TanStackRouterDevtools /> */}
            </DndProvider>
        </div>
    )
}
