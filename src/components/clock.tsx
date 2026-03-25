import { useEffect, useState } from 'react'

import { cn } from '@/helpers/tw-utils'

import { Button } from '@/components/ui/button'

export interface NavClockProps {
    className?: string
    buttonClassName?: string
    tooltipClassName?: string
}

const Clock = ({
    className,
    buttonClassName,
    tooltipClassName,
}: NavClockProps) => {
    const [time, setTime] = useState(new Date())
    const [is24Hour, setIs24Hour] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return (
        <div
            className={cn(
                'relative flex items-center pointer-events-auto',
                className
            )}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <Button
                className={cn(
                    'font-mono text-sm px-2 w-[110px]',
                    buttonClassName
                )}
                onClick={() => setIs24Hour(!is24Hour)}
                size="sm"
                variant="ghost"
            >
                {time.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: !is24Hour,
                })}
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
                        {time.toLocaleDateString('en-US', {
                            dateStyle: 'medium',
                        })}
                    </span>
                </div>
            )}
        </div>
    )
}

export default Clock
