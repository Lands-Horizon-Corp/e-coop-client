import { useMemo } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { useAuthUser } from '@/modules/authentication/authgentication.store'

import { BellIcon, DotBigIcon, RefreshIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'

import { useSubscribe } from '@/hooks/use-pubsub'

import { TEntityId } from '@/types'

import {
    useGetAllNotification,
    useViewAllNotification,
    useViewNotification,
} from '../notification.service'
import { INotification } from '../notification.types'

export const NotificationBellButton = ({
    notificationCount,
    onClick,
}: {
    notificationCount: number
    onClick: () => void
}) => {
    return (
        <Button
            aria-label="Notifications"
            className="relative"
            onClick={onClick}
            size="icon"
            variant="outline"
        >
            <BellIcon aria-hidden="true" size={16} />
            {notificationCount > 0 && (
                <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
                    {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
            )}
        </Button>
    )
}

export const NotificationNav = () => {
    const {
        currentAuth: {
            user: { id },
        },
    } = useAuthUser()

    const {
        data: notifications = [],
        isRefetching,
        refetch,
    } = useGetAllNotification()

    useSubscribe(`notification.create.user.${id}`, () => refetch())

    const {
        unreadCount,
    }: {
        readNotifications: INotification[]
        unreadNotifications: INotification[]
        unreadCount: number
        totalCount: number
    } = useMemo(() => {
        const unreadNotifications: INotification[] = []
        const readNotifications: INotification[] = []

        for (const notification of notifications) {
            if (notification.is_viewed) readNotifications.push(notification)
            else unreadNotifications.push(notification)
        }

        return {
            unreadNotifications,
            readNotifications,
            totalCount: notifications.length,
            unreadCount: unreadNotifications.length,
        }
    }, [notifications])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    aria-label="Open notifications"
                    className="relative size-fit p-1.5"
                    size="icon"
                    variant="ghost"
                >
                    <BellIcon aria-hidden="true" size={16} />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-80 rounded-xl p-1"
                side="left"
            >
                <NotificationContainer
                    handleReload={refetch}
                    isLoading={isRefetching}
                    notifications={notifications}
                />
            </PopoverContent>
        </Popover>
    )
}

type Props = {
    className?: string
    notifications: INotification[]
    unreadCount?: number
    readCount?: number
    isLoading?: boolean
    handleReload?: () => void
}

const NotificationContainer = ({
    unreadCount = 0,
    className,
    notifications,
    isLoading,
    handleReload,
}: Props) => {
    const { mutateAsync, isPending } = useViewAllNotification()

    const handleMarkAllAsRead = () => {
        toast.promise(mutateAsync(), {
            loading: 'Marking all notifications as read...',
            success: 'All notifications marked as read',
            error: 'Failed to mark all notifications as read',
        })
    }

    return (
        <div className={cn('min-h-[300px]', className)}>
            <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                <div className="text-xs">Notifications</div>
                {unreadCount > 0 && (
                    <button
                        className="text-xs font-medium hover:underline"
                        disabled={isPending}
                        onClick={handleMarkAllAsRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            <div
                aria-orientation="horizontal"
                className="-mx-1 my-1 h-px bg-border"
                role="separator"
            />
            {notifications?.map((notification) => (
                <NotificationItem
                    className=""
                    key={notification.id}
                    notification={notification}
                />
            ))}
            {isLoading && (
                <>
                    <div className="p-4 bg-popover w-full space-y-2">
                        <div className="w-full flex items-center gap-x-2">
                            <Skeleton className="h-5 w-[80%]" />
                            <Skeleton className="h-5 w-[10%]" />
                        </div>
                        <div className="w-full flex items-center gap-x-2">
                            <Skeleton className="h-2 w-[40%]" />
                            <Skeleton className="h-2 w-[10%]" />
                        </div>
                    </div>
                    <div className="p-4 bg-popover w-full space-y-2">
                        <div className="w-full flex items-center gap-x-2">
                            <Skeleton className="h-5 w-[80%]" />
                            <Skeleton className="h-5 w-[10%]" />
                        </div>
                        <div className="w-full flex items-center gap-x-2">
                            <Skeleton className="h-2 w-[40%]" />
                            <Skeleton className="h-2 w-[10%]" />
                        </div>
                    </div>
                    <div className="p-4 bg-popover w-full space-y-2">
                        <div className="w-full flex items-center gap-x-2">
                            <Skeleton className="h-5 w-[80%]" />
                            <Skeleton className="h-5 w-[10%]" />
                        </div>
                        <div className="w-full flex items-center gap-x-2">
                            <Skeleton className="h-2 w-[40%]" />
                            <Skeleton className="h-2 w-[10%]" />
                        </div>
                    </div>
                </>
            )}
            {notifications?.length === 0 && !isLoading && (
                <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BellIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Notifications</EmptyTitle>
                        <EmptyDescription>
                            You&apos;re all caught up. New notifications will
                            appear here.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            className="text-xs"
                            onClick={handleReload}
                            size="sm"
                            variant="outline"
                        >
                            <RefreshIcon className="inline size-3" />
                            Refresh
                        </Button>
                    </EmptyContent>
                </Empty>
            )}
        </div>
    )
}

const NotificationItem = ({
    notification,
    className,
}: {
    notification: INotification
    className?: string
}) => {
    const { mutateAsync, isPending } = useViewNotification()

    const handleNotificationClick = (notificationId: TEntityId) => {
        toast.promise(mutateAsync({ ids: [notificationId] }), {
            loading: 'Marking notification as read...',
            success: 'Notification marked as read',
            error: 'Failed to mark notification as read',
        })
    }

    return (
        <div
            className={cn(
                'rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                className
            )}
            key={notification.id}
        >
            <div className="relative flex items-start gap-3 pe-3">
                <BellIcon className="size-9 rounded-md" />
                <div className="flex-1 space-y-1">
                    <button
                        className="text-left text-foreground/80 after:absolute after:inset-0"
                        disabled={isPending || notification.is_viewed}
                        onClick={() => handleNotificationClick(notification.id)}
                    >
                        <span className="font-medium text-foreground hover:underline">
                            {notification.title}
                        </span>{' '}
                        {notification.description}{' '}
                        <span className="font-medium text-foreground hover:underline">
                            {notification.notification_type}
                        </span>
                        .
                    </button>
                    <div className="text-xs text-muted-foreground">
                        {toReadableDate(notification.created_at)}{' '}
                        {dateAgo(notification.created_at)}
                    </div>
                </div>
                {!notification.is_viewed && (
                    <div className="absolute end-0 self-center">
                        <DotBigIcon />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notification
