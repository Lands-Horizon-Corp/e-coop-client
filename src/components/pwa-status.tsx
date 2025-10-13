import { useEffect, useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import { Wifi, WifiOff } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface PWAStatusProps {
    className?: string
}

export function PWAStatus({ className = '' }: PWAStatusProps) {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [showOfflineNotification, setShowOfflineNotification] =
        useState(false)

    // Debug mode - show status in development for testing
    const isDevelopment = process.env.NODE_ENV === 'development'

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            setShowOfflineNotification(false)
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

    // Show during development, offline state, or transition back online
    if (!isDevelopment) {
        return null
    }

    return (
        <div className={cn('fixed top-4 right-4 z-50', className)}>
            {/* Development Debug Mode */}

            {!isOnline && (
                <Badge
                    className="bg-yellow-500 dark:bg-yellow-600 text-yellow-950 dark:text-yellow-50 px-4 py-2 text-sm shadow-lg border-yellow-400 dark:border-yellow-500"
                    variant="outline"
                >
                    <WifiOff className="w-3 h-3 mr-2 animate-pulse" />
                    Working offline - Data will sync when connected
                </Badge>
            )}

            {isOnline && showOfflineNotification && (
                <Badge
                    className="bg-green-500 dark:bg-green-600 text-green-950 dark:text-green-50 px-4 py-2 text-sm shadow-lg border-green-400 dark:border-green-500"
                    variant="outline"
                >
                    <Wifi className="w-3 h-3 mr-2" />
                    Back online!
                </Badge>
            )}
        </div>
    )
}

export default PWAStatus
