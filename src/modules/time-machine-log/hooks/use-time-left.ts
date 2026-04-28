import { useEffect, useState } from 'react'

interface UseTimeLeftOptions {
    serverFrozenUntil?: string
    frozenAtInput?: string
    frozenUntilSeconds?: number
}

interface UseTimeLeftReturn {
    remainingTime: number
    now: Date
    isActive: boolean
}

/**
 * Hook to calculate remaining time for time machine
 * @param serverFrozenUntil - ISO date string when frozen until
 * @param frozenAtInput - ISO date string when frozen at
 * @param frozenUntilSeconds - Total seconds for the freeze duration
 */
export const useTimeLeft = ({
    serverFrozenUntil,
    frozenAtInput,
    frozenUntilSeconds,
}: UseTimeLeftOptions): UseTimeLeftReturn => {
    const [remainingTime, setRemainingTime] = useState<number>(0)
    const [now, setNow] = useState(new Date())

    const isActive = !!(serverFrozenUntil || frozenAtInput)

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Calculate remaining time
    useEffect(() => {
        // Priority 1: serverFrozenUntil (ISO date string - end time)
        if (serverFrozenUntil) {
            const endDate = new Date(serverFrozenUntil)
            const endTime = endDate.getTime()

            console.log(
                new Date(serverFrozenUntil).toLocaleTimeString('en-US', {
                    timeZone: 'UTC',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            )

            // Validate that the date was parsed correctly (not NaN)
            if (!isNaN(endTime)) {
                const current = now.getTime()
                const left = Math.max(0, Math.floor((endTime - current) / 1000))
                setRemainingTime(left)
                return
            }
        }

        // Priority 2: frozenAtInput + frozenUntilSeconds (duration-based)
        if (frozenAtInput && frozenUntilSeconds && serverFrozenUntil) {
            const startDate = new Date(frozenAtInput)
            const start = startDate.getTime()

            // Validate that the date was parsed correctly
            if (!isNaN(start)) {
                const total = Number(frozenUntilSeconds)

                if (!total || total <= 0) {
                    setRemainingTime(0)
                    return
                }

                const elapsed = (now.getTime() - start) / 1000
                const left = Math.max(0, Math.floor(total - elapsed))

                setRemainingTime(left)
                return
            }
        }

        // No valid data, set to 0
        setRemainingTime(0)
    }, [now, serverFrozenUntil, frozenAtInput, frozenUntilSeconds])

    return {
        remainingTime,
        now,
        isActive,
    }
}
