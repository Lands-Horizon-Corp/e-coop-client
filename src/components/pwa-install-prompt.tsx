import { useEffect, useState } from 'react'

import { cn } from '@/helpers/tw-utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

interface PWAInstallProps {
    className?: string
}

export function PWAInstallPrompt({ className = '' }: PWAInstallProps) {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null)

    // Debug mode - show prompt in development
    const isDevelopment = process.env.NODE_ENV === 'development'

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()
            // Stash the event so it can be triggered later
            setDeferredPrompt(e as BeforeInstallPromptEvent)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
        }
    }, [])

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt()

            // Wait for the user to respond to the prompt
            await deferredPrompt.userChoice

            // Clear the deferredPrompt
            setDeferredPrompt(null)
        }
    }

    // Show in development mode or when browser supports PWA
    if (!isDevelopment) {
        return null
    }

    return (
        <Card
            className={cn(
                'fixed bottom-4 left-4 right-4 z-50 border-primary bg-primary text-primary-foreground shadow-lg',
                className
            )}
        >
            <CardContent className="pt-0">
                <Button
                    className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    onClick={handleInstallClick}
                    size="sm"
                    variant="secondary"
                >
                    Install App
                </Button>
            </CardContent>
        </Card>
    )
}

export default PWAInstallPrompt
