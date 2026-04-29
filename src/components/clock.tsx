import { useEffect, useState } from 'react'

import { toReadableDateTime } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import {
    formatDuration,
    useAutoCancelTimeMachine,
    useTimeLeft,
} from '@/modules/time-machine-log'

import { Button } from '@/components/ui/button'

export interface NavClockProps {
    className?: string
    buttonClassName?: string
    tooltipClassName?: string
    onClick?: () => void
}

const Clock = ({
    className,
    buttonClassName,
    tooltipClassName,
    onClick,
}: NavClockProps) => {
    const {
        currentAuth: { user_organization },
    } = useAuthStore()

    const [time, setTime] = useState(new Date())
    const [showTooltip, setShowTooltip] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const hasActiveTimeMachine = !!user_organization?.time_machine_time

    const { remainingTime } = useTimeLeft({
        serverFrozenUntil: user_organization?.time_machine_log?.frozen_until,
    })

    let timeDiff: number | undefined

    if (user_organization?.time_machine_log?.frozen_until) {
        const frozenUntilTime = new Date(
            user_organization.time_machine_log.frozen_until
        ).getTime()
        timeDiff = frozenUntilTime - time.getTime()
    }

    useAutoCancelTimeMachine({
        isActive: hasActiveTimeMachine,
        timeDiff,
        userOrganizationId: user_organization?.id,
        currentTime: time,
        startTime: new Date(user_organization?.time_machine_time || ''),
    })

    const isLowTime = remainingTime <= 30 && remainingTime > 0
    const hasTimeMachineLog = !!user_organization?.time_machine_log
    return (
        <div
            className={cn(
                'relative flex items-center pointer-events-auto ',
                className
            )}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <Button
                className={cn(
                    'relative overflow-visible',
                    hasActiveTimeMachine && 'snake-border',
                    buttonClassName
                )}
                onClick={() => {
                    onClick?.()
                }}
                size="sm"
                variant="ghost"
            >
                {user_organization?.time_machine_time && (
                    <span className="ml-1">
                        {toReadableDateTime(
                            user_organization?.time_machine_time
                        )}
                    </span>
                )}
                {!user_organization?.time_machine_time && (
                    <>
                        {time.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                        })}
                    </>
                )}
            </Button>
            {showTooltip && (
                <div
                    className={cn(
                        'absolute top-full mt-2 left-1/2 -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md whitespace-nowrap z-50',
                        tooltipClassName
                    )}
                >
                    <span className="font-semibold text-muted-foreground mr-1">
                        Timezone:
                    </span>
                    <span className="mr-2">{localTimeZone}</span>
                    <span className="border-l border-border pl-2">
                        {hasTimeMachineLog &&
                            time.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                            })}{' '}
                        {time.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>

                    {hasActiveTimeMachine &&
                        user_organization?.time_machine_time && (
                            <>
                                <div className="mt-2 flex justify-center border-t border-border pt-2">
                                    <span
                                        className={cn(
                                            'ml-1 font-semibold transition-colors',
                                            isLowTime &&
                                                'text-red-500 animate-pulse'
                                        )}
                                    >
                                        {formatDuration(remainingTime)}
                                        {isLowTime && ' - Expiring soon!'}
                                    </span>
                                </div>
                            </>
                        )}
                </div>
            )}
        </div>
    )
}

export default Clock
