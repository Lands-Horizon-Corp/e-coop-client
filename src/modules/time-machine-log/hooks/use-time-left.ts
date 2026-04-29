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

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (serverFrozenUntil) {
            const endDate = new Date(serverFrozenUntil)
            const endTime = endDate.getTime()

            if (!isNaN(endTime)) {
                const current = now.getTime()
                const left = Math.max(0, Math.floor((endTime - current) / 1000))
                setRemainingTime(left)
                return
            }
        }

        if (frozenAtInput && frozenUntilSeconds && serverFrozenUntil) {
            const startDate = new Date(frozenAtInput)
            const start = startDate.getTime()

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

        setRemainingTime(0)
    }, [now, serverFrozenUntil, frozenAtInput, frozenUntilSeconds])

    return {
        remainingTime,
        now,
        isActive,
    }
}
