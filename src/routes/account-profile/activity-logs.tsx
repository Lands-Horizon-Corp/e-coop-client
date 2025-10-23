import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { withCatchAsync } from '@/helpers/function-utils'
import { cn } from '@/helpers/tw-utils'
import { FootstepAPI, IFootstep } from '@/modules/footstep'
import FootstepDetail from '@/modules/footstep/components/footstep-detail'

import PageContainer from '@/components/containers/page-container'
import { FootstepsIcon, RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

import { useElementInView } from '@/hooks/use-element-in-view'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

export const Route = createFileRoute('/account-profile/activity-logs')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data, isPending, isFetching, fetchNextPage, refetch, hasNextPage } =
        useInfiniteQuery({
            queryKey: ['footstep', 'infinite', 'me-branch'],
            initialPageParam: {
                pageIndex: 0,
                pageSize: 10,
            },
            retry: 0,
            queryFn: async ({ pageParam: { pageIndex, pageSize } }) => {
                const [error, result] = await withCatchAsync(
                    FootstepAPI.getPaginated<IFootstep>({
                        query: { pageIndex, pageSize },
                        url: `${FootstepAPI.route}/me/search`,
                    })
                )

                if (error) {
                    const errorMessage = serverRequestErrExtractor({ error })
                    toast.error('Failed to load data, ' + errorMessage)
                    throw errorMessage
                }

                return result
            },
            getNextPageParam: (lastResponseDatas, _all, lastPage) => {
                if (lastResponseDatas.data.length < lastPage.pageSize)
                    return undefined
                return { ...lastPage, pageIndex: lastPage.pageIndex + 1 }
            },
            getPreviousPageParam: (_firstResponseDatas, _all, firstPage) => {
                if (firstPage.pageIndex <= 0) return undefined
                return { ...firstPage, pageIndex: firstPage.pageIndex - 1 }
            },
        })

    const ActivityLogs = data?.pages.flatMap((page) => page.data) ?? []

    const { ref } = useElementInView<HTMLDivElement>({
        onEnterView() {
            if (hasNextPage) {
                fetchNextPage()
            }
        },
    })

    return (
        <PageContainer className="max-w-4xl bg-secondary/20 text-secondary-foreground rounded-3xl mx-auto p-4">
            <div className="flex justify-between w-full items-center">
                <div className="space-y-2">
                    <p className="text-4xl">Activity Logs</p>
                    <p className="text-sm text-muted-foreground/80">
                        See your full activity logs
                    </p>
                </div>
                <Button
                    className="size-fit p-2"
                    disabled={isPending || isFetching}
                    onClick={() => refetch()}
                    size="icon"
                    variant="secondary"
                >
                    {isFetching || isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <RefreshIcon />
                    )}
                </Button>
            </div>
            {isPending && <LoadingSpinner className="mx-auto" />}
            {ActivityLogs.length === 0 && !isPending && (
                <Empty className="from-muted/50 w-full to-background h-full bg-gradient-to-b from-30%">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FootstepsIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Activity Logs</EmptyTitle>
                        <EmptyDescription>
                            No activity recorded yet. Your actions will appear
                            here.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            disabled={isPending || isFetching}
                            onClick={() => refetch()}
                            size="sm"
                            variant="outline"
                        >
                            {isFetching || isPending ? (
                                <LoadingSpinner />
                            ) : (
                                <RefreshIcon />
                            )}
                            Refresh
                        </Button>
                    </EmptyContent>
                </Empty>
            )}
            {ActivityLogs.length > 0 && (
                <div className="border rounded-xl w-full">
                    {ActivityLogs.map((footstep) => (
                        <ActivityItem
                            className="last:border-b-0 border-b"
                            footstep={footstep}
                            key={footstep.id}
                        />
                    ))}
                    {!hasNextPage && !isFetching && (
                        <p className="text-center text-xs last:border-b-0 border-0 text-muted-foreground/70 py-4">
                            no more to load
                        </p>
                    )}
                    {isFetching && (
                        <div className="rounded-none p-4 w-full flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="w-56 h-6" />
                                <div className="flex items-center gap-x-2">
                                    <Skeleton className="w-16 h-4" />
                                    <Skeleton className="w-48 h-4" />
                                    <Skeleton className="w-16 h-4" />
                                </div>
                            </div>
                            <Skeleton className="w-16 h-4" />
                        </div>
                    )}
                    {!isFetching && <span ref={ref} />}
                </div>
            )}
        </PageContainer>
    )
}

const ActivityItem = ({
    footstep,
    className,
}: IClassProps & { footstep: IFootstep }) => {
    const viewFootstepModal = useModalState()

    return (
        <div
            className={cn(
                'p-4 flex items-start cursor-pointer ease-in-out group duration-200 hover:bg-secondary/80 dark:hover:bg-secondary/20 justify-between gap-4',
                className
            )}
            onClick={() => viewFootstepModal.onOpenChange(true)}
        >
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                    {footstep.module}
                </p>
                <p className="text-sm text-muted-foreground">
                    {footstep.activity}
                    {footstep.description ? ` — ${footstep.description}` : ''}
                </p>
                {(footstep.organization || footstep.branch) && (
                    <p className="text-xs text-muted-foreground/70 inline-flex items-center gap-x-2">
                        {footstep.branch && (
                            <span>Branch: {footstep.branch?.name ?? '-'}</span>
                        )}
                        {footstep.organization && (
                            <span>
                                Organization:{' '}
                                {footstep.organization?.name ?? '-'}
                            </span>
                        )}
                    </p>
                )}
            </div>
            <div>
                <div className="text-right">
                    <ActionTooltip
                        tooltipContent={toReadableDateTime(footstep.created_at)}
                    >
                        <p className="text-xs text-muted-foreground/70 whitespace-nowrap">
                            {dateAgo(footstep.created_at)}
                        </p>
                    </ActionTooltip>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Sheet {...viewFootstepModal}>
                            <SheetContent
                                className="!max-w-lg bg-transparent p-2 focus:outline-none border-none"
                                side="right"
                            >
                                <div className="rounded-xl bg-popover p-6 ecoop-scroll relative h-full overflow-y-auto">
                                    <FootstepDetail footstep={footstep} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </div>
    )
}
