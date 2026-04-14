import { useEffect, useState } from 'react'

import { toReadableDate } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'

import { Kbd, KbdGroup } from '@/components/ui/kbd'

import { formatTime } from '../time-machine-log.utils'

interface ITimeLeftProps {
    serverFrozenUntil?: string
    frozenAtInput?: string
    frozenUntilSeconds?: number
    frozenAtValue?: string
    timezone?: string
}

const TimeLeft = ({
    serverFrozenUntil,
    frozenAtInput,
    frozenUntilSeconds,
    frozenAtValue,
    timezone = 'UTC',
}: ITimeLeftProps) => {
    const [remainingTime, setRemainingTime] = useState<number>(0)
    const [now, setNow] = useState(new Date())
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (serverFrozenUntil) {
            const end = new Date(serverFrozenUntil).getTime()
            const current = now.getTime()

            const left = Math.max(0, Math.floor((end - current) / 1000))
            setRemainingTime(left)
            return
        }

        if (frozenAtInput && frozenUntilSeconds) {
            const start = new Date(frozenAtInput).getTime()
            const total = Number(frozenUntilSeconds)

            if (!total || total <= 0) return

            const elapsed = (now.getTime() - start) / 1000
            const left = Math.max(0, Math.floor(total - elapsed))

            setRemainingTime(left)
        }
        setRemainingTime(0)
    }, [now, serverFrozenUntil, frozenAtInput, frozenUntilSeconds])

    const T12Hour = now.toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    })

    const T24Hour = now.toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex justify-end">
                <Kbd
                    className={cn('', remainingTime > 0 ? 'text-primary' : '')}
                >
                    {frozenAtInput ? 'Preview:' : 'Active:'} Time left:{' '}
                    <span
                        className={cn(
                            '',
                            remainingTime > 0 ? 'animate-pulse' : ''
                        )}
                    >
                        {formatTime(remainingTime)}s
                    </span>
                </Kbd>
            </div>
            <KbdGroup className="space-y-1 flex-col items-start bg-card p-4 rounded">
                {frozenAtValue ? (
                    <>
                        <Kbd className="text-sm">
                            Froze at: {toReadableDate(frozenAtValue)}
                        </Kbd>
                    </>
                ) : (
                    'Froze at: N/A'
                )}
                {T12Hour && <Kbd className="text-sm">12-hour: {T12Hour}</Kbd>}
                {T24Hour && <Kbd className="text-sm">24-hour: {T24Hour}</Kbd>}
            </KbdGroup>
        </div>
    )
}

export default TimeLeft
