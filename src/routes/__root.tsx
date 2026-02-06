import { Outlet, createRootRoute } from '@tanstack/react-router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import AuthLoader from '@/modules/authentication/components/auth-loader'
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

import { usePusherConnect } from '@/hooks/use-pubsub'

import ErrorPage from './-common-pages/error-page'
import NotFoundPage from './-common-pages/not-found-page'

export const Route = createRootRoute({
    component: RootLayout,
    errorComponent: ErrorPage,
    notFoundComponent: NotFoundPage,
})

function RootLayout() {
    usePusherConnect()

    return (
        <div className="relative">
            <AuthLoader />
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
                                '!bg-muted ' +
                                'dark:!bg-transparent dark:!bg-gradient-to-tr ' +
                                '!border-b-muted-foreground/30 !border-muted-foreground/20 ' +
                                'dark:!from-muted dark:!to-background ' +
                                '!text-muted-foreground',

                            error:
                                '!p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 ' +
                                '!bg-rose-50 dark:!bg-transparent dark:!bg-gradient-to-tr ' +
                                '!border-b-destructive !border-destructive ' +
                                'dark:!from-destructive dark:!to-background ' +
                                '!text-foreground',

                            warning:
                                '!p-4 !rounded-xl !border-t-0 !border-x-0 !border-b-1 ' +
                                '!bg-[#e8915f]/60 dark:!bg-transparent dark:!bg-gradient-to-tr ' +
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
