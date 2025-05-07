import { Toaster } from 'sonner'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import CookieConsent from '@/components/cookie-consent'
import ConfirmModal from '@/components/modals/confirm-modal'
import ConnectionProvider from '@/providers/connection-provider'
import ImagePreviewModal from '@/components/image-preview/image-preview-modal'
import { useAuthStore } from '@/store/user-auth-store'
import { useAuthContext } from '@/hooks/api-hooks/use-auth'
import { AxiosError } from 'axios'

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
    const { setAuthStatus, resetAuth } = useAuthStore()

    useAuthContext({
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

    return (
        <div className="relative">
            <Outlet />
            <Toaster richColors closeButton />
            <ConnectionProvider />
            <CookieConsent />
            <ImagePreviewModal />
            <ConfirmModal />
            <TanStackRouterDevtools />
        </div>
    )
}
