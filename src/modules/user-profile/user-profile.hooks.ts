import { useEffect, useRef } from 'react'

const INTERVAL_TIME = 1000 * 60 * 60
const INTERVAL_START_TIME = 1000 * 60 * 5

const events: Array<keyof WindowEventMap> = [
    'mousedown',
    'mousemove',
    'wheel',
    'keydown',
    'touchstart',
    'scroll',
    // ... add other events here ...
]

const addListeners = (
    events: Array<keyof WindowEventMap>,
    cb: EventListenerOrEventListenerObject
): (() => void) => {
    events.forEach((event) =>
        window.addEventListener(event, cb, {
            passive: true,
        } as AddEventListenerOptions)
    )

    return () => {
        events.forEach((event) =>
            window.removeEventListener(event, cb, {
                passive: true,
            } as AddEventListenerOptions)
        )
    }
}

export const useUserProfileInactivity = ({
    onInactivity,
    onActivity,
    interval = INTERVAL_TIME,
    intervalStart = INTERVAL_START_TIME,
    startInactivity,
    disabled = false,
}: {
    onInactivity: () => void
    startInactivity: () => void
    onActivity: () => void
    interval?: number
    intervalStart?: number
    disabled?: boolean
}) => {
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const startIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const unlistenRef = useRef<() => void | undefined>(undefined)
    const wasActiveRef = useRef(false)
    const isInactiveRef = useRef(false)
    const hasStartedRef = useRef(false)

    useEffect(() => {
        if (disabled) {
            return
        }

        const checkInactivity = () => {
            if (wasActiveRef.current) {
                // User was active, reset inactivity state
                if (isInactiveRef.current) {
                    isInactiveRef.current = false
                    onActivity()
                }
                // Reset the start inactivity state
                if (hasStartedRef.current) {
                    hasStartedRef.current = false
                }
                wasActiveRef.current = false
            } else {
                // User was inactive for the interval period
                if (!isInactiveRef.current) {
                    isInactiveRef.current = true
                    onInactivity()
                }
            }
        }

        const checkStartInactivity = () => {
            if (wasActiveRef.current) {
                // User was active, reset
                wasActiveRef.current = false
                hasStartedRef.current = false
            } else {
                // User was inactive for the start interval period
                if (!hasStartedRef.current) {
                    hasStartedRef.current = true
                    startInactivity()
                }
            }
        }

        // Start the initial inactivity check (shorter interval)
        startIntervalRef.current = setInterval(
            checkStartInactivity,
            intervalStart
        )

        // Start the main inactivity check interval (longer interval)
        intervalRef.current = setInterval(checkInactivity, interval)

        // Add activity event listeners
        unlistenRef.current = addListeners(events, () => {
            wasActiveRef.current = true
        })

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
            if (startIntervalRef.current) {
                clearInterval(startIntervalRef.current)
            }
            if (unlistenRef.current) {
                unlistenRef.current()
            }
        }
    }, [
        onInactivity,
        onActivity,
        interval,
        intervalStart,
        startInactivity,
        disabled,
    ])

    // Return cleanup function for manual cleanup if needed
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        if (unlistenRef.current) {
            unlistenRef.current()
        }
    }
}
