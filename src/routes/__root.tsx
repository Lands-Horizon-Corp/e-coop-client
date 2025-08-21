import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { NATS_PASS, NATS_USER } from '@/constants'
import { IAuthContext, useAuthContext } from '@/modules/authentication'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { ActionSecurityProvider } from '@/providers/action-security-provider'
import ConnectionProvider from '@/providers/connection-provider'

import CookieConsent from '@/components/cookie-consent'
// import ImagePreviewModal from '@/components/image-preview/image-preview-modal'
import ConfirmModal from '@/components/modals/confirm-modal'
import InfoModal from '@/components/modals/info-modal'
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
                    expand
                    richColors
                    closeButton
                    theme="system"
                    className="z-[9999]"
                />
                <Outlet />
                <ConnectionProvider />
                <CookieConsent />

                {/*
                <ImagePreviewModal /> */}
                <ConfirmModal />
                <InfoModal />
                <TanStackRouterDevtools />
                <ActionSecurityProvider />
            </DndProvider>
        </div>
    )
}
