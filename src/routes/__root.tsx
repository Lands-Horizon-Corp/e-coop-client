// import { NATS_PASS, NATS_USER } from "@/constants";
// import { ActionSecurityProvider } from '@/providers/action-security-provider'
// import ConnectionProvider from '@/providers/connection-provider'
// import { useAuthStore } from '@/store/user-auth-store'
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { AxiosError } from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// import CookieConsent from '@/components/cookie-consent'
// import ErrorPage from '@/components/elements/pages/error-page'
// import NotFoundPage from '@/components/elements/pages/not-found-page'
// import ImagePreviewModal from '@/components/image-preview/image-preview-modal'
// import ConfirmModal from '@/components/modals/confirm-modal'
// import InfoModal from '@/components/modals/info-modal'
// import { Toaster } from '@/components/ui/sonner'

// import { useAuthContext } from '@/hooks/api-hooks/use-auth'
// import { useNatsConnect } from '@/hooks/use-pubsub'

export const Route = createRootRoute({
    component: RootLayout,
    // errorComponent: ErrorPage,
    // notFoundComponent: NotFoundPage,
});

function RootLayout() {
    // const { setAuthStatus, setCurrentAuth, resetAuth } = useAuthStore()

    // useAuthContext({
    //     onSuccess(authorizationContext) {
    //         setCurrentAuth(authorizationContext)
    //     },
    //     onError(_error, rawError) {
    //         if (rawError instanceof AxiosError && rawError.status === 401) {
    //             resetAuth()
    //             setAuthStatus('unauthorized')
    //             return null
    //         }

    //         if (rawError instanceof AxiosError && rawError.status === 500) {
    //             setAuthStatus('error')
    //             return null
    //         }

    //         setAuthStatus('error')
    //     },
    //     refetchOnWindowFocus: false,
    // })

    // useNatsConnect({ user: NATS_USER, pass: NATS_PASS })

    return (
        <div className="relative">
            <DndProvider backend={HTML5Backend}>
                {/* <Toaster
                    expand
                    richColors
                    closeButton
                    theme="system"
                    className="z-[9999]"
                /> */}
                <Outlet />
                {/* <ConnectionProvider />
                <CookieConsent />
                <ImagePreviewModal />
                <ConfirmModal />
                <InfoModal /> */}
                <TanStackRouterDevtools />
                {/* <ActionSecurityProvider /> */}
            </DndProvider>
        </div>
    );
}
