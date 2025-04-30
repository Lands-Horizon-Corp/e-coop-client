import { Outlet } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import CookieConsent from '@/components/cookie-consent'
import ConfirmModal from '@/components/modals/confirm-modal'
import ConnectionProvider from '@/providers/connection-provider'
import useFetchCurrentUser from '@/hooks/use-fetch-current-user'
import ImagePreviewModal from '@/components/image-preview/image-preview-modal'

const RootLayout = () => {
    useFetchCurrentUser({ refetchOnWindowFocus: false })
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
