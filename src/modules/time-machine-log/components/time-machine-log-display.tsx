import { forwardRef } from 'react'

import { cn } from '@/helpers'
import { ITimeMachineLog } from '@/modules/time-machine-log'
import { formatDistance } from 'date-fns'

import TextDisplay from '../../../components/text-display'
import { Badge } from '../../../components/ui/badge'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../../components/ui/popover'

type Props = {
    log: ITimeMachineLog
    triggerClassName?: string
    contentClassName?: string
    showDescription?: boolean
    trigger?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const statusColors = {
    active: 'bg-green-100 text-green-800 hover:bg-green-200',
    inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    revoked: 'bg-red-100 text-red-800 hover:bg-red-200',
}

const TimeMachineLogDisplay = forwardRef<HTMLDivElement, Props>(
    (
        {
            log,
            triggerClassName,
            contentClassName,
            showDescription = true,
            className,
            trigger,
            ...props
        },
        ref
    ) => {
        const frozenDate = new Date(log.frozen_at)
        const unfrozenDate = new Date(log.frozen_until)
        const now = new Date()

        const timeUntilUnfreeze = formatDistance(unfrozenDate, now, {
            addSuffix: unfrozenDate > now,
        })

        return (
            <div className={cn('w-full', className)} ref={ref} {...props}>
                <Popover>
                    <PopoverTrigger asChild>
                        {trigger ? (
                            trigger
                        ) : (
                            <button
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                    statusColors[log.status || 'active'],
                                    triggerClassName
                                )}
                            >
                                <span className="h-2 w-2 rounded-full bg-current" />
                                {log.status || 'active'}
                            </button>
                        )}
                    </PopoverTrigger>

                    <PopoverContent
                        align="start"
                        className={cn('space-y-4', contentClassName)}
                    >
                        {/* Header */}
                        <div className="space-y-2 border-b pb-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">
                                    Time Machine Log
                                </h3>
                                <Badge className="text-xs" variant="outline">
                                    {log.status || 'active'}
                                </Badge>
                            </div>
                            {showDescription && log.description && (
                                <p className="text-xs text-muted-foreground">
                                    {log.description}
                                </p>
                            )}
                        </div>

                        {/* Timeline Information */}
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Frozen At
                                </span>
                                <TextDisplay className="text-right">
                                    {formatDistance(frozenDate, now, {
                                        addSuffix: true,
                                    })}
                                </TextDisplay>
                            </div>

                            <div className="flex items-start justify-between gap-3">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Unfreezes
                                </span>
                                <TextDisplay className="text-right">
                                    {timeUntilUnfreeze}
                                </TextDisplay>
                            </div>

                            <div className="flex items-start justify-between gap-3">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Timezone
                                </span>
                                <TextDisplay className="text-right">
                                    {log.timezone}
                                </TextDisplay>
                            </div>
                        </div>

                        {/* User Information */}
                        {log.user && (
                            <div className="border-t pt-4">
                                <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
                                    User
                                </h4>
                                <div className="space-y-2 rounded-md bg-secondary/30 p-2 text-xs">
                                    <TextDisplay noValueText="-">
                                        {log.user?.full_name || '-'}
                                    </TextDisplay>
                                </div>
                            </div>
                        )}

                        {/* Reason */}
                        {log.reason && (
                            <div className="border-t pt-4">
                                <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
                                    Reason
                                </h4>
                                <p className="rounded-md bg-secondary/30 p-2 text-xs">
                                    {log.reason}
                                </p>
                            </div>
                        )}
                        {log.description && (
                            <div className="border-t pt-4">
                                <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
                                    Description
                                </h4>
                                <p className="rounded-md bg-secondary/30 p-2 text-xs">
                                    {log.description}
                                </p>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)

TimeMachineLogDisplay.displayName = 'TimeMachineLogDisplay'

export default TimeMachineLogDisplay
