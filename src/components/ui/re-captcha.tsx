import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'

import { toast } from 'sonner'

import { CloseIcon } from '../icons'

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

        const handleClose = useCallback(() => {
            setIsVisible(false)
        }, [])

        // Initialize Turnstile when component becomes visible
        useEffect(() => {
            const siteKey = import.meta.env.VITE_TURNSTILE_CAPTCHA_SITE_KEY
            if (!isVisible || !window.turnstile || !siteKey) {
                return
            }

            const captchaElement = document.getElementById(DEFAULT_CONTAINER_ID)
            if (captchaElement) {
                captchaElement.innerHTML = ''
            }

            // Add a small delay to ensure DOM is ready
            const timeoutId = setTimeout(() => {
                try {
                    const widgetId = window.turnstile.render(
                        `#${DEFAULT_CONTAINER_ID}`,
                        {
                            sitekey: siteKey,
                            callback: handleSuccess,
                            'error-callback': handleError,
                        }
                    )

                    widgetIdRef.current = widgetId
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
                if (widgetIdRef.current) {
                    window.turnstile.remove(widgetIdRef.current)
                    widgetIdRef.current = null
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isVisible])

        // Reset widget when visibility changes
        useEffect(() => {
            if (!isVisible && widgetIdRef.current) {
                window.turnstile.remove(widgetIdRef.current)
                widgetIdRef.current = null
            }
        }, [isVisible])

        if (!isVisible) {
            return null
        }

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="relative rounded-lg bg-card border border-border px-6 py-6 shadow-xl">
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <CloseIcon className="size-4" />
                    </button>
                    <div className="mb-4 text-center">
                        <h3 className="text-lg font-medium text-foreground">
                            Verify you're human
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Please complete the CAPTCHA to continue.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div
                            ref={containerRef}
                            id={DEFAULT_CONTAINER_ID}
                            className="flex min-h-[65px] items-center justify-center"
                        />
                    </div>
                </div>
            </div>
        )
    }
)

ChatReCaptcha.displayName = 'ChatReCaptcha'

export default ChatReCaptcha
