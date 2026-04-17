import { TEntityId } from '@/types/common'

import RefreshButton from '@/components/buttons/refresh-button'
import { EmptyIcon } from '@/components/icons'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

import { useGetTimeMachineLogs } from '../time-machine-log.service'
import TimeMachineListItem from './time-mahine-list-item'

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
        <div className="flex border flex-col p-5 bg-background w-1/2 gap-2 ecoop-scroll overflow-auto max-h-[80vh] rounded-xl">
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
                    <TimeMachineListItem key={log.id} log={log} />
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
