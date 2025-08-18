import { useInfiniteQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import footstepService from '@/api-service/footstep-service'
import { serverRequestErrExtractor } from '@/helpers'
import { cn } from '@/helpers/tw-utils'
import { dateAgo, toReadableDateTime, withCatchAsync } from '@/utils'
import { createFileRoute } from '@tanstack/react-router'

import ActionTooltip from '@/components/action-tooltip'
import FootstepDetail from '@/components/elements/sheet-displays/footstep-detail'
import { RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

import { useElementInView } from '@/hooks/use-element-in-view'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IFootstep } from '@/types'

export const Route = createFileRoute('/account/activity-logs')({
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
            queryFn: async ({ pageParam: { pageIndex, pageSize } }) => {
                const [error, result] = await withCatchAsync(
                    footstepService.search({
                        pagination: { pageIndex, pageSize },
                        targetUrl: 'branch/search',
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

    // const ActivityLogs: IFootstep[] = [
    //     {
    //         id: '1',
    //         module: 'Authentication',
    //         activity: 'Login',
    //         description: 'User successfully logged in',
    //         branch_id: 'QC-001',
    //         user_type: 'member',
    //         user_id: 'u-001',
    //         user: { id: 'u-001', name: 'Juan Dela Cruz' },
    //         latitude: null,
    //         longitude: null,
    //         ip_address: '192.168.1.10',
    //         user_agent: 'Mozilla/5.0',
    //         referer: null,
    //         location: 'Quezon City',
    //         accept_language: 'en-US',
    //         created_at: '2025-07-29T08:15:00.000Z',
    //     },
    //     {
    //         id: '2',
    //         module: 'Payments',
    //         activity: 'Transaction',
    //         description: 'Paid monthly dues',
    //         branch_id: 'MKT-002',
    //         user_type: 'employee',
    //         user_id: 'u-002',
    //         user: { id: 'u-002', name: 'Maria Santos' },
    //         latitude: 14.5547,
    //         longitude: 121.0244,
    //         ip_address: '10.0.0.1',
    //         user_agent: 'Chrome/105.0',
    //         referer: 'https://dashboard.ecoop.com',
    //         location: 'Makati',
    //         accept_language: 'en-US',
    //         created_at: '2025-07-28T17:00:00.000Z',
    //     },
    //     {
    //         id: '3',
    //         module: 'Member Profile',
    //         activity: 'Update',
    //         description: 'Changed address info',
    //         branch_id: 'CUB-003',
    //         user_type: 'member',
    //         user_id: 'u-003',
    //         user: { id: 'u-003', name: 'Pedro Reyes' },
    //         latitude: null,
    //         longitude: null,
    //         ip_address: '203.0.113.5',
    //         user_agent: 'Safari/14.1',
    //         referer: null,
    //         location: 'Cubao',
    //         accept_language: 'en-PH',
    //         created_at: '2025-07-28T13:45:00.000Z',
    //     },
    //     {
    //         id: '4',
    //         module: 'Account Settings',
    //         activity: 'Password Change',
    //         description: null,
    //         branch_id: null,
    //         user_type: 'owner',
    //         user_id: 'u-004',
    //         user: { id: 'u-004', name: 'Ana Bautista' },
    //         latitude: 14.5995,
    //         longitude: 120.9842,
    //         ip_address: '172.16.0.2',
    //         user_agent: 'Edge/120.0',
    //         referer: null,
    //         location: 'Manila',
    //         accept_language: 'en-US',
    //         created_at: '2025-07-27T21:30:00.000Z',
    //     },
    // ] as unknown as IFootstep[]

    const ActivityLogs = data?.pages.flatMap((page) => page.data) ?? []

    const { ref } = useElementInView<HTMLDivElement>({
        onEnterView() {
            if (hasNextPage) {
                fetchNextPage()
            }
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <p className="text-4xl">Activity Logs</p>
                    <p className="text-sm text-muted-foreground/80">
                        See your full activity logs
                    </p>
                </div>
                <Button
                    size="icon"
                    variant="secondary"
                    className="size-fit p-2"
                    onClick={() => refetch()}
                >
                    {isFetching || isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <RefreshIcon />
                    )}
                </Button>
            </div>
            <div className="border rounded-xl">
                {ActivityLogs.length === 0 && !isFetching && (
                    <p className="w-full text-center py-24 text-muted-foreground text-sm">
                        No activity yet
                    </p>
                )}
                {ActivityLogs.map((footstep) => (
                    <ActivityItem
                        key={footstep.id}
                        footstep={footstep}
                        className="last:border-b-0 border-b"
                    />
                ))}
                {!hasNextPage && !isFetching && (
                    <p className="text-center text-xs last:border-b-0 border-0 text-muted-foreground/70 py-4">
                        no more to load
                    </p>
                )}
                {isFetching ? (
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
                ) : (
                    <span ref={ref} />
                )}
            </div>
        </div>
    )
}

const ActivityItem = ({
    footstep,
    className,
}: IClassProps & { footstep: IFootstep }) => {
    const viewFootstepModal = useModalState()

    return (
        <div
            onClick={() => viewFootstepModal.onOpenChange(true)}
            className={cn(
                'p-4 flex items-start cursor-pointer ease-in-out group duration-200 hover:bg-secondary/80 dark:hover:bg-secondary/20 justify-between gap-4',
                className
            )}
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
                                side="right"
                                className="!max-w-lg bg-transparent p-2 focus:outline-none border-none"
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
