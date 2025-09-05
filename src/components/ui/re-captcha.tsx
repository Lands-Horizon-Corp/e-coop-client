import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'

import { toast } from 'sonner'

import { TURNSTILE_CAPTCHA_SITE_KEY } from '@/constants'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './dialog'

interface ChatReCaptchaProps {
    onSuccess: (token: string) => void
    onError?: (error: Error) => void
}

export interface ChatReCaptchaRef {
    show: () => void
    hide: () => void
}

const DEFAULT_CONTAINER_ID = 'chat-recaptcha-container'

const ChatReCaptcha = forwardRef<ChatReCaptchaRef, ChatReCaptchaProps>(
    ({ onSuccess, onError }, ref) => {
        const widgetIdRef = useRef<string | null>(null)
        const containerRef = useRef<HTMLDivElement>(null)
        const [isVisible, setIsVisible] = useState(false)

        useImperativeHandle(ref, () => ({
            show: () => setIsVisible(true),
            hide: () => setIsVisible(false),
        }))

        const handleSuccess = useCallback(
            (token: string) => {
                setIsVisible(false) // Auto-hide after success
                onSuccess(token)
            },
            [onSuccess]
        )

        const handleError = useCallback(
            (error: Error) => {
                console.error('ChatReCaptcha error:', error)
                toast.error('Something went wrong. Please try again.')
                setIsVisible(false)
                onError?.(error)
            },
            [onError]
        )

        // Initialize Turnstile when component becomes visible
        useEffect(() => {
            const siteKey = TURNSTILE_CAPTCHA_SITE_KEY

            if (!isVisible) {
                return
            }

            // If no site key is configured, auto-succeed
            if (!siteKey) {
                handleSuccess('bypass-token')
                return
            }

            if (!window.turnstile) {
                return
            }

            const captchaElement = document.getElementById(DEFAULT_CONTAINER_ID)
            if (captchaElement) {
                captchaElement.innerHTML = ''
            }

            // Add a small delay to ensure DOM is ready
            const timeoutId = setTimeout(() => {
                try {
                    if (window.turnstile) {
                        const widgetId = window.turnstile.render(
                            `#${DEFAULT_CONTAINER_ID}`,
                            {
                                sitekey: siteKey,
                                callback: handleSuccess,
                                'error-callback': handleError,
                            }
                        )
                        widgetIdRef.current = widgetId
                    }
                } catch (error) {
                    console.error(
                        'ChatReCaptcha: Failed to render Turnstile:',
                        error
                    )
                    handleError(error as Error)
                }
            }, 100)

            return () => {
                clearTimeout(timeoutId)

                // Cleanup Turnstile widget
                if (widgetIdRef.current && window.turnstile) {
                    window.turnstile.remove(widgetIdRef.current)
                    widgetIdRef.current = null
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isVisible])

        // Reset widget when visibility changes
        useEffect(() => {
            if (!isVisible && widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current)
                widgetIdRef.current = null
            }
        }, [isVisible])

        return (
            <Dialog open={isVisible} onOpenChange={setIsVisible}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Verify you're human</DialogTitle>
                        <DialogDescription>
                            Please complete the CAPTCHA to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center">
                        <div
                            ref={containerRef}
                            id={DEFAULT_CONTAINER_ID}
                            className="flex min-h-[65px] items-center justify-center"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
)

ChatReCaptcha.displayName = 'ChatReCaptcha'

export default ChatReCaptcha
