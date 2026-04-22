import React from 'react'

import { cn, formatDate } from '@/helpers'
import { format } from 'date-fns'

import { ITimeMachineLog } from '../time-machine-log.types'
import TimeMachineLogDisplay from './time-machine-log-display'

type Props = {
    log: ITimeMachineLog
    onClick?: (log: ITimeMachineLog) => void
    className?: string
}

const TimeMachineListItem = ({ log, className }: Props) => {
    const now = new Date()
    const unfrozenDate = new Date(log.frozen_until)
    const isExpired = unfrozenDate < now

    return (
        <TimeMachineLogDisplay
            contentClassName="max-w-sm"
            log={log}
            trigger={
                <div
                    className={cn(
                        'flex items-center w-full justify-between rounded-xl border px-2 py-1 bg-card',
                        log.is_active ? 'border-green-500/40' : 'border-muted'
                    )}
                    key={log.id}
                >
                    {/* LEFT */}
                    <div className="flex items-center gap-4 min-w-0">
                        {/* STATUS DOT */}
                        <div
                            className={cn(
                                'h-2.5 w-2.5 rounded-full',
                                log.is_active ? 'bg-green-500' : 'bg-gray-400'
                            )}
                        />

                        {/* TIME */}
                        <div className="text-xs font-medium">
                            {formatDate(log.frozen_at)}
                        </div>

                        {/* REASON */}
                        <div className="text-xs text-muted-foreground truncate max-w-[170px]">
                            {log.reason || 'No reason'}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4 text-xs">
                        {/* COUNTDOWN */}
                        <span
                            className={cn(
                                'font-mono',
                                log.is_active
                                    ? 'text-primary'
                                    : 'text-destructive'
                            )}
                        >
                            {format(new Date(log.frozen_at), 'hh:mm:ss a')}
                        </span>

                        {/* STATUS */}
                        <span
                            className={cn(
                                'text-xs px-2 py-1 rounded-md',
                                log.is_active
                                    ? 'bg-green-500/10 text-green-600'
                                    : 'bg-muted text-muted-foreground'
                            )}
                        >
                            {log.is_active ? 'ACTIVE' : 'ENDED'}
                        </span>
                    </div>
                </div>
            }
            triggerClassName={cn(
                'w-full text-left p-4 rounded-lg border',
                isExpired
                    ? 'bg-red-100 border-red-300'
                    : 'bg-green-100 border-green-300',
                'hover:bg-opacity-75 cursor-pointer',
                className
            )}
        />
    )
}

export default React.memo(TimeMachineListItem)
