import { Toaster } from 'sonner'
import { AxiosError } from 'axios'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { useNatsConnect } from '@/hooks/use-pubsub'
import { useAuthStore } from '@/store/user-auth-store'
import CookieConsent from '@/components/cookie-consent'
import { useAuthContext } from '@/hooks/api-hooks/use-auth'
import ConfirmModal from '@/components/modals/confirm-modal'
import ConnectionProvider from '@/providers/connection-provider'
import ImagePreviewModal from '@/components/image-preview/image-preview-modal'
import { ActionSecurityProvider } from '@/providers/action-security-provider'

export const Route = createRootRoute({
    component: RootLayout,
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
            <Outlet />
            <Toaster richColors theme="system" closeButton expand />
            <ConnectionProvider />
            <CookieConsent />
            <ImagePreviewModal />
            <ConfirmModal />
            <TanStackRouterDevtools />
            <ActionSecurityProvider />
        </div>
    )
}
