import { toReadableDate } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'

import { Kbd, KbdGroup } from '@/components/ui/kbd'

import { TEntityId } from '@/types'

import { useTimeLeft } from '../index'
import { formatTime } from '../time-machine-log.utils'

interface ITimeLeftProps {
    serverFrozenUntil?: string
    frozenAtInput?: string
    frozenUntilSeconds?: number
    frozenAtValue?: string
    timezone?: string
    userOrganizationId?: TEntityId
    // Display options
    showFrozeAt?: boolean
    showTimeFormats?: boolean
    showLabel?: boolean
    showAnimation?: boolean
    compact?: boolean
}

const TimeLeft = ({
    serverFrozenUntil,
    frozenAtInput,
    frozenUntilSeconds,
    frozenAtValue,
    timezone = 'UTC',
    showFrozeAt = true,
    showTimeFormats = true,
    showLabel = true,
    showAnimation = true,
    compact = false,
}: ITimeLeftProps) => {
    const { remainingTime, now } = useTimeLeft({
        serverFrozenUntil,
        frozenAtInput,
        frozenUntilSeconds,
    })

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

    const isLowTime = remainingTime <= 30 && remainingTime > 0
    const timeLeftDisplay = (
        <Kbd
            className={cn(
                '',
                showAnimation && isLowTime
                    ? 'animate-pulse text-destructive self-center'
                    : ''
            )}
        >
            {showLabel && (
                <>{frozenAtInput ? 'Preview:' : 'Active:'} Time left: </>
            )}
            <span
                className={cn(
                    '',
                    showAnimation && isLowTime
                        ? 'animate-pulse text-destructive self-center'
                        : ''
                )}
            >
                {formatTime(remainingTime)}s{isLowTime && ' - Expiring soon!'}
            </span>
        </Kbd>
    )

    // Compact display - just the time left
    if (compact) {
        return timeLeftDisplay
    }

    // Full display
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex justify-end">{timeLeftDisplay}</div>
            {(showFrozeAt || showTimeFormats) && (
                <KbdGroup className="space-y-1 flex-col items-start bg-card p-4 rounded">
                    {showFrozeAt && (
                        <>
                            {frozenAtValue ? (
                                <Kbd className="text-sm">
                                    Froze at: {toReadableDate(frozenAtValue)}
                                </Kbd>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Froze at: N/A
                                </div>
                            )}
                        </>
                    )}
                    {showTimeFormats && (
                        <>
                            {T12Hour && (
                                <Kbd className="text-sm">
                                    12-hour: {T12Hour}
                                </Kbd>
                            )}
                            {T24Hour && (
                                <Kbd className="text-sm">
                                    24-hour: {T24Hour}
                                </Kbd>
                            )}
                        </>
                    )}
                </KbdGroup>
            )}
        </div>
    )
}

export default TimeLeft
