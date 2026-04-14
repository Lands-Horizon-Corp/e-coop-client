import { cn } from '@/helpers/tw-utils'
import { TEntityId } from '@/types/common'

import RefreshButton from '@/components/buttons/refresh-button'
import { EmptyIcon } from '@/components/icons'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { useGetTimeMachineLogs } from '../time-machine-log.service'
import { formatTime } from '../time-machine-log.utils'

interface ITimeMachineLogsListProps {
    userOrganizationId?: TEntityId
}

const TimeMachineLogsList = ({
    userOrganizationId,
}: ITimeMachineLogsListProps) => {
    const {
        data: timeMachine,
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useGetTimeMachineLogs({
        options: {
            enabled: !!userOrganizationId,
        },

        userOrganizationId,
    })

    return (
        <div className="flex flex-col p-5 bg-background w-1/2 gap-2 ecoop-scroll overflow-auto max-h-[80vh] rounded-xl">
            <div className="flex items-center justify-between">
                <h1>Time Machine Logs</h1>
                <RefreshButton className="self-end" onClick={() => refetch()} />
            </div>
            {isLoading ||
                (isRefetching && (
                    <div>
                        <Skeleton className="h-10 w-full mb-2 rounded-xl" />
                        <Skeleton className="h-10 w-full mb-2 rounded-xl" />
                        <Skeleton className="h-10 w-full mb-2 rounded-xl" />
                    </div>
                ))}
            {timeMachine
                ?.sort(
                    (a, b) =>
                        new Date(b.frozen_at).getTime() -
                        new Date(a.frozen_at).getTime()
                )
                ?.map((log) => (
                    <div
                        className={cn(
                            'flex items-center w-full justify-between rounded-xl border px-2 py-1 bg-card',
                            log.is_active
                                ? 'border-green-500/40'
                                : 'border-muted'
                        )}
                        key={log.id}
                    >
                        {/* LEFT */}
                        <div className="flex items-center gap-4 min-w-0">
                            {/* STATUS DOT */}
                            <div
                                className={cn(
                                    'h-2.5 w-2.5 rounded-full',
                                    log.is_active
                                        ? 'bg-green-500'
                                        : 'bg-gray-400'
                                )}
                            />

                            {/* TIME */}
                            <div className="text-xs font-medium">
                                {new Date(log.frozen_at).toLocaleString()}
                            </div>

                            {/* REASON */}
                            <Tooltip delayDuration={1100}>
                                <TooltipTrigger>
                                    <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                                        {log.reason || 'No reason'}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-secondary text-primary">
                                    <p>{log.reason || 'No reason provided'}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4 text-xs">
                            {/* COUNTDOWN */}
                            <span
                                className={cn(
                                    'font-mono',
                                    new Date(log.frozen_until).getTime() -
                                        Date.now() <=
                                        0
                                        ? 'text-red-500'
                                        : 'text-primary'
                                )}
                            >
                                {formatTime(
                                    new Date(log.frozen_until).getTime()
                                )}
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
                ))}

            {(error || timeMachine?.length === 0) && (
                <Empty className="mt-10">
                    <EmptyTitle>No logs available</EmptyTitle>
                    <EmptyIcon />
                    <EmptyDescription>
                        No time machine logs found for this organization.
                    </EmptyDescription>
                </Empty>
            )}
        </div>
    )
}
export default TimeMachineLogsList
