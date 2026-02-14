import { useCallback, useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
export const usePWA = () => {
    const [progress, setProgress] = useState(0)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null)
    const [error, setError] = useState<string | null>(null)
    const installApp = async () => {
        if (!deferredPrompt) return
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') setDeferredPrompt(null)
    }
    const startDownload = useCallback(async () => {
        if (!isOnline) return
        setIsDownloading(true)
        setError(null)
        try {
            const res = await fetch(`/pwa-assets.json?v=${Date.now()}`)
            const assets: string[] = await res.json()
            const cache = await caches.open('local-assets')
            let count = 0
            for (const url of assets) {
                if (!navigator.onLine) break
                const match = await cache.match(url)
                if (!match) {
                    try {
                        const fetchRes = await fetch(url)
                        if (fetchRes.ok) await cache.put(url, fetchRes)
                    } catch (fileErr) {
                        console.error(`Failed: ${url}`, fileErr)
                    }
                }
                count++
                setProgress(Math.round((count / assets.length) * 100))
            }
        } catch (manifestErr) {
            console.error('Manifest Error:', manifestErr)
            setError('Failed to initialize offline sync.')
        } finally {
            setIsDownloading(false)
        }
    }, [isOnline])
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        const handlePrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
        }
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        window.addEventListener('beforeinstallprompt', handlePrompt)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('beforeinstallprompt', handlePrompt)
        }
    }, [])
    const uninstallPWA = async () => {
        try {
            await caches.delete('local-assets')
            const registrations =
                await navigator.serviceWorker.getRegistrations()
            for (const registration of registrations) {
                await registration.unregister()
            }
            setProgress(0)
            window.location.reload()
        } catch (err) {
            console.error('Uninstall failed:', err)
            setError('Failed to clear app data.')
        }
    }
    useEffect(() => {
        const verifyExistingCache = async () => {
            try {
                const res = await fetch(`/pwa-assets.json?v=${Date.now()}`)
                if (!res.ok) return
                const assets: string[] = await res.json()
                const cache = await caches.open('local-assets')

                let found = 0
                for (const url of assets) {
                    const match = await cache.match(url)
                    if (match) found++
                }

                if (assets.length > 0) {
                    const currentProgress = Math.round(
                        (found / assets.length) * 100
                    )
                    setProgress(currentProgress)
                    if (
                        currentProgress < 100 &&
                        found > 0 &&
                        navigator.onLine
                    ) {
                        console.log('New version detected. Re-syncing...')
                        startDownload()
                    }
                }
            } catch (err) {
                console.warn('Cache verification skipped', err)
            }
        }
        verifyExistingCache()
    }, [isOnline, startDownload])
    return {
        progress,
        isDownloading,
        isOnline,
        startDownload,
        installApp,
        uninstallPWA,
        isInstallable: !!deferredPrompt,
        error,
    }
}

export default usePWA
