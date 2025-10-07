import { useCallback } from 'react'

import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { NATS_PASS, NATS_USER } from '@/constants'
import { IAuthContext, useAuthContext } from '@/modules/authentication'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { ActionSecurityProvider } from '@/providers/action-security-provider'
import ConnectionProvider from '@/providers/connection-provider'
import { HotkeysProvider } from 'react-hotkeys-hook'

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
import { ShortcutProvider } from '@/components/shorcuts/general-shortcuts-wrapper'
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
        <HotkeysProvider>
            <ShortcutProvider>
                <div className="relative">
                    <DndProvider backend={HTML5Backend}>
                        <Toaster
                            richColors
                            closeButton
                            theme="system"
                            className="z-[9999] toaster group"
                            toastOptions={{
                                classNames: {
                                    icon: 'flex items-center !mr-2 justify-center',
                                    success:
                                        '!bg-gradient-to-tr !p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 !border-b-green-500 !from-green-500/20 !to-background !text-foreground !border-green-600',
                                    info: '!bg-gradient-to-tr !p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 !border-b-blue-500 !from-blue-500/20 !to-background !text-foreground !border-blue-600',
                                    loading:
                                        '!bg-gradient-to-tr !p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 !border-b-primary !from-primary/40 !to-background !text-foreground !border-primary',
                                    error: '!bg-gradient-to-tr !p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 !border-b-rose-400 !from-rose-400/20 !to-background !text-foreground !border-rose-400',
                                    warning:
                                        '!bg-gradient-to-tr !p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 !border-b-[#e8915f] !from-[#e8915f]/20 !to-popover !text-foreground !border-[#e8915f]',
                                },
                            }}
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
                        />
                        <Outlet />
                        <ConnectionProvider />
                        <CookieConsent />
                        <ImagePreviewModal />
                        <ConfirmModal />
                        <InfoModal />
                        {/* <TanStackRouterDevtools /> */}
                        <ActionSecurityProvider />
                    </DndProvider>
                </div>
            </ShortcutProvider>
        </HotkeysProvider>
    )
}
