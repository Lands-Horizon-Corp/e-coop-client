import { useCallback, useEffect, useRef } from 'react'

import {
    IUserProfileInactivitySettings,
    TInactivityTimeUnit,
    TUserProfileInactivitySettings,
    logger,
} from '@/modules/user-profile'

import { getLocalStorage, setLocalStorage } from '@/hooks/use-localstorage'

import {
    ACTIVITY_DEBOUNCE_TIME,
    ACTIVITY_GRACE_PERIOD,
    ACTIVITY_STORAGE_KEY,
    INACTIVITY_SETTINGS_KEY,
    POLLING_INTERVAL,
} from '../user-profile.constants'

export const DEFAULT_INACTIVITY_SETTINGS: TUserProfileInactivitySettings = {
    enabled: false,
    duration: 15,
    timeUnit: 'minutes',
}

const saveActivityToLocalStorage = (timestamp: number) => {
    try {
        setLocalStorage(ACTIVITY_STORAGE_KEY, timestamp.toString())
    } catch (error) {
        logger.error(
            'Activity Tracker Hooke : Failed to save user activity timestamp to localStorage:',
            error
        )
    }
}

export const loadUserProfileInactivitySettings =
    (): IUserProfileInactivitySettings => {
        try {
            const stored = getLocalStorage<TUserProfileInactivitySettings>(
                INACTIVITY_SETTINGS_KEY
            )
            return stored || DEFAULT_INACTIVITY_SETTINGS
        } catch (error) {
            logger.error(
                'Activity Tracker Hooke : Failed to retrieve inactivity settings from localStorage:',
                error
            )
            return DEFAULT_INACTIVITY_SETTINGS
        }
    }

export const saveUserProfileInactivitySettings = (
    newSettings: IUserProfileInactivitySettings
) => {
    setLocalStorage(INACTIVITY_SETTINGS_KEY, newSettings)
}

const getLastActivityFromLocalStorage = (): number | null => {
    try {
        const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY)
        return stored ? Number(stored) : null
    } catch (error) {
        logger.error(
            'Activity Tracker Hooke : Failed to retrieve activity from localStorage:',
            error
        )
        return null
    }
}

const calculateLastActivityFromNow = (
    now: number = Date.now(),
    lastActivity: number
) => {
    return now - lastActivity
}

export const useUserProfileInactivity = ({
    onInactivity,
    onActivity,
    activityGracePeriod = ACTIVITY_GRACE_PERIOD,
    disabled = false,
}: {
    onInactivity?: (prevActivity: number, currentActivity: number) => void
    onActivity?: ({
        eventType,
        prevActivityTimestamp,
        currentActivityTimestamp,
    }: {
        eventType: string
        prevActivityTimestamp: number
        currentActivityTimestamp: number
    }) => void
    activityGracePeriod?: number
    disabled?: boolean
}) => {
    const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})
    const lastActivityRef = useRef<number | null>(null)
    const lastSavedActivityRef = useRef<number | null>(null) // Track last saved time
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const isInactiveRef = useRef(false)
    const listenersActiveRef = useRef(false)
    const handleActivityRef = useRef<((event: Event) => void) | null>(null)
    const wasDisabledRef = useRef(disabled) // Track previous disabled state

    // Retrieve last activity on mount only
    useEffect(() => {
        const stored = getLastActivityFromLocalStorage()
        // Initialize with stored value or current time
        lastActivityRef.current = stored ?? Date.now()
        lastSavedActivityRef.current = lastActivityRef.current

        // If no stored value, save the initial timestamp
        if (!stored) {
            saveActivityToLocalStorage(Date.now())
        }
    }, [])

    const addEventListeners = (handleActivity: (event: Event) => void) => {
        if (listenersActiveRef.current) return

        window.addEventListener('mousemove', handleActivity)
        window.addEventListener('keydown', handleActivity)
        window.addEventListener('click', handleActivity)
        window.addEventListener('scroll', handleActivity)
        listenersActiveRef.current = true
    }

    const removeEventListeners = (handleActivity: (event: Event) => void) => {
        if (!listenersActiveRef.current) return

        window.removeEventListener('mousemove', handleActivity)
        window.removeEventListener('keydown', handleActivity)
        window.removeEventListener('click', handleActivity)
        window.removeEventListener('scroll', handleActivity)
        listenersActiveRef.current = false
    }

    const startPolling = useCallback(
        (handleActivity: (event: Event) => void) => {
            // Clear existing interval if any
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
            }

            pollingIntervalRef.current = setInterval(() => {
                const now = Date.now()
                const lastActivity = lastActivityRef.current

                if (
                    lastActivity &&
                    calculateLastActivityFromNow(now, lastActivity) >=
                        activityGracePeriod
                ) {
                    // console.log('INACTIVE', {
                    //     lastActivity,
                    //     now,
                    //     diff: now - lastActivity,
                    //     grace: activityGracePeriod,
                    // })

                    // User is inactive
                    isInactiveRef.current = true

                    // Pause polling
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current)
                        pollingIntervalRef.current = null
                    }

                    // Pause activity tracking
                    removeEventListeners(handleActivity)

                    // Call onInactivity callback
                    onInactivity?.(lastActivity, now)
                } else if (lastActivity) {
                    // console.log('ACTIVE', {
                    //     // lastActivity,
                    //     // now,
                    //     diff: now - lastActivity,
                    //     grace: activityGracePeriod,
                    // })
                }
            }, POLLING_INTERVAL)
        },
        [activityGracePeriod, onInactivity]
    )

    const restartTracking = useCallback(() => {
        isInactiveRef.current = false

        // Update last activity to now
        const now = Date.now()
        lastActivityRef.current = now
        lastSavedActivityRef.current = now
        saveActivityToLocalStorage(now)

        // Restart event listeners
        if (handleActivityRef.current) {
            addEventListeners(handleActivityRef.current)
            startPolling(handleActivityRef.current)
        }
    }, [startPolling])

    useEffect(() => {
        if (disabled) {
            // Stop tracking when disabled
            const timers = debounceTimers.current
            Object.values(timers).forEach(clearTimeout)

            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
                pollingIntervalRef.current = null
            }

            if (handleActivityRef.current) {
                removeEventListeners(handleActivityRef.current)
            }

            wasDisabledRef.current = true
            return
        }

        // Resume tracking when re-enabled
        if (wasDisabledRef.current && !disabled) {
            // Update activity timestamp to now when resuming
            const now = Date.now()
            lastActivityRef.current = now
            lastSavedActivityRef.current = now
            saveActivityToLocalStorage(now)
            isInactiveRef.current = false
        }

        wasDisabledRef.current = disabled

        const timers = debounceTimers.current

        const handleActivity = (event: Event) => {
            // Skip if inactive state is active
            if (isInactiveRef.current) return

            const eventType = event.type
            const now = Date.now()

            // Update activity immediately (for polling check)
            lastActivityRef.current = now

            // Clear existing timer for this event type
            if (timers[eventType]) {
                clearTimeout(timers[eventType])
            }

            // Debounce the localStorage save and callback
            timers[eventType] = setTimeout(() => {
                const timestamp = Date.now()

                // Only save if enough time has passed since last save
                if (
                    !lastSavedActivityRef.current ||
                    timestamp - lastSavedActivityRef.current >=
                        ACTIVITY_DEBOUNCE_TIME
                ) {
                    lastSavedActivityRef.current = timestamp
                    saveActivityToLocalStorage(timestamp)
                    onActivity?.({
                        prevActivityTimestamp: lastActivityRef.current || 0,
                        currentActivityTimestamp: timestamp,
                        eventType,
                    })

                    // console.log('Activity saved to localStorage', { timestamp })
                }
            }, ACTIVITY_DEBOUNCE_TIME)
        }

        handleActivityRef.current = handleActivity

        addEventListeners(handleActivity)
        startPolling(handleActivity)

        return () => {
            Object.values(timers).forEach(clearTimeout)

            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
            }

            removeEventListeners(handleActivity)
            handleActivityRef.current = null
        }
    }, [disabled, onActivity, startPolling])

    return {
        restartTracking,
    }
}

export const resolveInactivityDuration = (
    timUnit: TInactivityTimeUnit,
    duration: number
) => {
    switch (timUnit) {
        case 'minutes':
            return duration * 60 * 1000
        case 'hours':
            return duration * 60 * 60 * 1000
        default:
            return 5 * 60 * 1000
    }
}
