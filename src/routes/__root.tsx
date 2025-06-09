import { AxiosError } from 'axios'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Toaster } from '@/components/ui/sonner'
import CookieConsent from '@/components/cookie-consent'
import ConfirmModal from '@/components/modals/confirm-modal'
import ErrorPage from '@/components/elements/pages/error-page'
import NotFoundPage from '@/components/elements/pages/not-found-page'
import ImagePreviewModal from '@/components/image-preview/image-preview-modal'

import { useNatsConnect } from '@/hooks/use-pubsub'
import { useAuthStore } from '@/store/user-auth-store'
import { useAuthContext } from '@/hooks/api-hooks/use-auth'
import ConnectionProvider from '@/providers/connection-provider'
import { ActionSecurityProvider } from '@/providers/action-security-provider'

export const Route = createRootRoute({
    component: RootLayout,
    errorComponent: ErrorPage,
    notFoundComponent: NotFoundPage,
})

function RootLayout() {
    const { setAuthStatus, setCurrentAuth, resetAuth } = useAuthStore()

    useAuthContext({
        onSuccess(authorizationContext) {
            setCurrentAuth(authorizationContext)
        },
        onError(_error, rawError) {
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
        refetchOnWindowFocus: false,
    })

    useNatsConnect()

    return (
        <div className="relative">
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
            <ImagePreviewModal />
            <ConfirmModal />
            <TanStackRouterDevtools />
            <ActionSecurityProvider />
        </div>
    )
}
