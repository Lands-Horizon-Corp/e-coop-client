import { AxiosError } from 'axios'
import { Outlet } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import CookieConsent from '@/components/cookie-consent'
import ConfirmModal from '@/components/modals/confirm-modal'
import ConnectionProvider from '@/providers/connection-provider'
import ImagePreviewModal from '@/components/image-preview/image-preview-modal'

import { useAuthStore } from '@/store/user-auth-store'
import { useAuthContext } from '@/hooks/api-hooks/use-auth'

const RootLayout = () => {
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
        </div>
    )
}

export default RootLayout
