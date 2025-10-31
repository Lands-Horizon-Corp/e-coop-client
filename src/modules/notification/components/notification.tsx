import { useMemo } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { useAuthUser } from '@/modules/authentication/authgentication.store'

import {
    BellIcon,
    DotBigIcon,
    ErrorIcon,
    RefreshIcon,
    WarningIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useSubscribe } from '@/hooks/use-pubsub'

import { TEntityId } from '@/types'

import {
    useGetAllNotification,
    useViewAllNotification,
    useViewNotification,
} from '../notification.service'
import { INotification, TNotificationType } from '../notification.types'

const getNotificationIcon = (type: TNotificationType) => {
    switch (type) {
        case 'Error':
            return ErrorIcon
        case 'Warning':
            return WarningIcon
        case 'Info':
        default:
            return BellIcon
    }
}

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
        isPending,
        refetch,
    } = useGetAllNotification()

    useSubscribe(`notification.create.user.${id}`, () => refetch())

    const {
        unreadCount,
        readNotifications,
        unreadNotifications,
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
                className="w-[400px] rounded-xl p-1"
                side="left"
            >
                <NotificationContainer
                    handleReload={refetch}
                    isLoading={isRefetching}
                    isPending={isPending}
                    notifications={notifications}
                    readNotifications={readNotifications}
                    unreadCount={unreadCount}
                    unreadNotifications={unreadNotifications}
                />
            </PopoverContent>
        </Popover>
    )
}

type Props = {
    className?: string
    notifications: INotification[]
    unreadNotifications?: INotification[]
    readNotifications?: INotification[]
    unreadCount?: number
    readCount?: number
    isLoading?: boolean
    isPending?: boolean
    handleReload?: () => void
}

const NotificationContainer = ({
    unreadCount = 0,
    className,
    notifications,
    unreadNotifications = [],
    readNotifications = [],
    isLoading,
    isPending,
    handleReload,
}: Props) => {
    const { mutateAsync, isPending: isTagingViewAll } = useViewAllNotification()

    const handleMarkAllAsRead = () => {
        toast.promise(mutateAsync(), {
            loading: 'Marking all notifications as read...',
            success: 'All notifications marked as read',
            error: 'Failed to mark all notifications as read',
        })
    }

    const renderNotificationList = (notificationList: INotification[]) => (
        <>
            {notificationList.map((notification) => (
                <NotificationItem
                    className=""
                    key={notification.id}
                    notification={notification}
                />
            ))}
        </>
    )

    const renderSkeletons = () => (
        <>
            {[1, 2, 3].map((i) => (
                <div className="p-4 bg-popover w-full space-y-2" key={i}>
                    <div className="w-full flex items-center gap-x-2">
                        <Skeleton className="h-5 w-[80%]" />
                        <Skeleton className="h-5 w-[10%]" />
                    </div>
                    <div className="w-full flex items-center gap-x-2">
                        <Skeleton className="h-2 w-[40%]" />
                        <Skeleton className="h-2 w-[10%]" />
                    </div>
                </div>
            ))}
        </>
    )

    const renderEmpty = () => (
        <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <BellIcon />
                </EmptyMedia>
                <EmptyTitle>No Notifications</EmptyTitle>
                <EmptyDescription>
                    You&apos;re all caught up. New notifications will appear
                    here.
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
    )

    return (
        <div className={cn('min-h-[300px]', className)}>
            <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                <div className="text-xl">
                    Notifications
                    {!isPending && isLoading && (
                        <LoadingSpinner className="inline size-3 ml-2" />
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        className="text-xs cursor-pointer font-medium hover:underline"
                        disabled={isTagingViewAll}
                        onClick={handleMarkAllAsRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            <Tabs className="w-full" defaultValue="all">
                <TabsList className="w-full mb-5 justify-start">
                    <TabsTrigger
                        className="text-xs relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        value="all"
                    >
                        All{' '}
                        {notifications.length > 0 && (
                            <Badge
                                className="ml-2 px-1.5 rounded-sm"
                                variant="secondary"
                            >
                                {notifications.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        className="text-xs relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        value="unread"
                    >
                        Unread{' '}
                        {unreadCount > 0 && (
                            <Badge
                                className="ml-2 rounded-sm px-1.5"
                                variant="secondary"
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        className="text-xs relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        value="read"
                    >
                        Red{' '}
                        {readNotifications.length > 0 && (
                            <Badge
                                className="ml-2 rounded-sm px-1.5"
                                variant="secondary"
                            >
                                {readNotifications.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>
                <TabsContent className="mt-2" value="all">
                    {isPending && renderSkeletons()}
                    {!isPending && notifications.length === 0 && renderEmpty()}
                    {!isPending &&
                        notifications.length > 0 &&
                        renderNotificationList(notifications)}
                </TabsContent>
                <TabsContent className="mt-2" value="unread">
                    {isPending && renderSkeletons()}
                    {!isPending &&
                        unreadNotifications.length === 0 &&
                        renderEmpty()}
                    {!isPending &&
                        unreadNotifications.length > 0 &&
                        renderNotificationList(unreadNotifications)}
                </TabsContent>
                <TabsContent className="mt-2" value="read">
                    {isPending && renderSkeletons()}
                    {!isPending &&
                        readNotifications.length === 0 &&
                        renderEmpty()}
                    {!isPending &&
                        readNotifications.length > 0 &&
                        renderNotificationList(readNotifications)}
                </TabsContent>
            </Tabs>
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
    const { mutateAsync } = useViewNotification()

    const handleNotificationClick = (notificationId: TEntityId) => {
        toast.promise(mutateAsync({ ids: [notificationId] }), {
            loading: 'Marking notification as read...',
            success: 'Notification marked as read',
            error: 'Failed to mark notification as read',
        })
    }

    const NotificationIconComponent = getNotificationIcon(
        notification.notification_type
    )

    return (
        <div
            className={cn(
                'rounded-2xl px-3 py-3 text-sm transition-colors hover:bg-accent/70',
                className,
                !notification.is_viewed && 'cursor-pointer'
            )}
            key={notification.id}
        >
            <div className="relative flex items-start gap-3 pe-3">
                <NotificationIconComponent className="size-4 rounded-md" />
                <div className="flex-1 space-y-1">
                    <div
                        className="text-left space-y-1 disabled:cursor-auto cursor-pointer text-foreground/80 after:absolute after:inset-0"
                        onClick={() => {
                            if (notification.is_viewed) return
                            handleNotificationClick(notification.id)
                        }}
                    >
                        <p className="font-medium text-foreground hover:underline">
                            {notification.title}
                        </p>{' '}
                        <p className="text-sm">{notification.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {toReadableDate(notification.created_at)}{' '}
                        {dateAgo(notification.created_at)}
                    </div>
                </div>
                {!notification.is_viewed && (
                    <div className="absolute end-0 self-center">
                        <DotBigIcon className="text-primary animate-pulse " />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notification
