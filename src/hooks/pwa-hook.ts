import { useCallback, useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

interface PWAHookReturn {
    // Install prompt state
    canInstall: boolean
    isInstalled: boolean
    showInstallPrompt: boolean

    // Network state
    isOnline: boolean
    showOfflineNotification: boolean

    // Actions
    installApp: () => Promise<void>
    dismissInstallPrompt: () => void

    // Environment
    isDevelopment: boolean

    // PWA capabilities
    isStandalone: boolean
    supportsPWA: boolean
}

export function usePWA(): PWAHookReturn {
    // Install prompt state
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null)
    const [canInstall, setCanInstall] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [_showInstallPrompt, setShowInstallPrompt] = useState(false)

    // Network state
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [showOfflineNotification, setShowOfflineNotification] =
        useState(false)

    // Environment detection
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.navigator as any).standalone === true
    const supportsPWA = 'serviceWorker' in navigator && 'PushManager' in window

    // Debug mode for development
    const [debugShow, setDebugShow] = useState(isDevelopment)

    // Install prompt event handler
    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()

            // Stash the event so it can be triggered later
            const promptEvent = e as BeforeInstallPromptEvent
            setDeferredPrompt(promptEvent)
            setCanInstall(true)
            setShowInstallPrompt(true)
        }

        // Listen for app installed event
        const installedHandler = () => {
            setIsInstalled(true)
            setCanInstall(false)
            setShowInstallPrompt(false)
            setDeferredPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', handler)
        window.addEventListener('appinstalled', installedHandler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
            window.removeEventListener('appinstalled', installedHandler)
        }
    }, [])

    // Network status handlers
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            setShowOfflineNotification(true)
            // Auto-hide "back online" notification after 3 seconds
            setTimeout(() => setShowOfflineNotification(false), 3000)
        }

        const handleOffline = () => {
            setIsOnline(false)
            setShowOfflineNotification(true)
            // Auto-hide offline notification after 5 seconds
            setTimeout(() => setShowOfflineNotification(false), 5000)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Check if app is already installed
    useEffect(() => {
        if (isStandalone) {
            setIsInstalled(true)
            setCanInstall(false)
            setShowInstallPrompt(false)
        }
    }, [isStandalone])

    // Install app function
    const installApp = useCallback(async () => {
        if (deferredPrompt) {
            try {
                // Show the install prompt
                await deferredPrompt.prompt()

                // Wait for the user to respond to the prompt
                const choiceResult = await deferredPrompt.userChoice

                if (choiceResult.outcome === 'accepted') {
                    setIsInstalled(true)
                }

                // Clear the deferredPrompt
                setDeferredPrompt(null)
                setCanInstall(false)
                setShowInstallPrompt(false)
            } catch (error) {
                console.error('Error during PWA installation:', error)
            }
        } else if (isDevelopment) {
            // Fallback for development/unsupported browsers
            alert(`To install e-coop-suite:

1. Chrome/Edge: Look for the install icon in the address bar
2. Mobile: Use "Add to Home Screen" from browser menu
3. Or visit the app at: https://ecoop-suite.com

PWA features work best in production mode.`)
        }
    }, [deferredPrompt, isDevelopment])

    // Dismiss install prompt
    const dismissInstallPrompt = useCallback(() => {
        setShowInstallPrompt(false)
        setDebugShow(false)
    }, [])

    // Determine if we should show install prompt
    const shouldShowInstallPrompt = canInstall || (isDevelopment && debugShow)

    return {
        // Install prompt state
        canInstall,
        isInstalled,
        showInstallPrompt: shouldShowInstallPrompt,

        // Network state
        isOnline,
        showOfflineNotification,

        // Actions
        installApp,
        dismissInstallPrompt,

        // Environment
        isDevelopment,

        // PWA capabilities
        isStandalone,
        supportsPWA,
    }
}

export default usePWA
