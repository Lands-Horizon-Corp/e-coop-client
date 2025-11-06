import { useMemo } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { useAuthUser } from '@/modules/authentication/authgentication.store'

import {
    BellIcon,
    BugIcon,
    CheckFillIcon,
    DiamondWarningIcon,
    DotBigIcon,
    DotsHorizontalIcon,
    EmailIcon,
    ErrorIcon,
    InfoFillCircleIcon,
    LoadingCircleIcon,
    MonitorCogIcon,
    RefreshIcon,
    TrashIcon,
    WarningIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { TEntityId } from '@/types'

import {
    useDeleteNotificationById,
    useGetAllNotification,
    useViewAllNotification,
    useViewNotification,
} from '../notification.service'
import { INotification, TNotificationType } from '../notification.types'
import { NotificationInfoViewModal } from './notification-view'

export const getNotificationIcon = (type: TNotificationType) => {
    switch (type) {
        case 'error':
            return ErrorIcon
        case 'warning':
            return WarningIcon
        case 'alert':
            return DiamondWarningIcon
        case 'debug':
            return BugIcon
        case 'message':
            return EmailIcon
        case 'system':
            return MonitorCogIcon
        case 'info':
            return InfoFillCircleIcon
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
                className="w-[400px] max-h-[80vh] rounded-xl p-1 flex flex-col"
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
                <div className="p-2 bg-popover w-full space-y-2" key={i}>
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
        <div className={cn('flex flex-col min-h-0 flex-1', className)}>
            <div className="flex items-baseline justify-between gap-4 px-3 py-2 flex-shrink-0">
                <div className="text-xl">Notifications</div>
                <div className="flex items-center gap-2">
                    <Button
                        className="size-fit p-1 "
                        disabled={isLoading || isPending}
                        onClick={handleReload}
                        size="icon"
                        variant="ghost"
                    >
                        {isLoading || isPending ? (
                            <LoadingCircleIcon className="size-3 animate-spin" />
                        ) : (
                            <RefreshIcon className="size-3" />
                        )}
                    </Button>
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
            </div>
            <Tabs
                className="w-full flex flex-col min-h-0 flex-1"
                defaultValue="all"
            >
                <TabsList className="w-full relative mb-2 justify-start flex-shrink-0">
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
                        Veiwed{' '}
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
                <TabsContent
                    className="mt-4 overflow-y-auto ecoop-scroll flex-1 min-h-0"
                    value="all"
                >
                    {isPending && renderSkeletons()}
                    {!isPending && notifications.length === 0 && renderEmpty()}
                    {!isPending &&
                        notifications.length > 0 &&
                        renderNotificationList(notifications)}
                    {notifications.length > 5 && (
                        <div className="sticky bottom-0 w-full bg-gradient-to-t from-popover to-transparent h-8" />
                    )}
                </TabsContent>
                <TabsContent
                    className="mt-4 overflow-y-auto ecoop-scroll flex-1 min-h-0"
                    value="unread"
                >
                    {isPending && renderSkeletons()}
                    {!isPending &&
                        unreadNotifications.length === 0 &&
                        renderEmpty()}
                    {!isPending &&
                        unreadNotifications.length > 0 &&
                        renderNotificationList(unreadNotifications)}
                    {unreadNotifications.length > 5 && (
                        <div className="sticky bottom-0 w-full bg-gradient-to-t from-popover to-transparent h-8" />
                    )}
                </TabsContent>
                <TabsContent
                    className="mt-4 overflow-y-auto ecoop-scroll flex-1 min-h-0"
                    value="read"
                >
                    {isPending && renderSkeletons()}
                    {!isPending &&
                        readNotifications.length === 0 &&
                        renderEmpty()}
                    {!isPending &&
                        readNotifications.length > 0 &&
                        renderNotificationList(readNotifications)}
                    {readNotifications.length > 5 && (
                        <div className="sticky bottom-0 w-full bg-gradient-to-t from-popover to-transparent h-8" />
                    )}
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
    const viewModalState = useModalState()
    const { mutateAsync } = useViewNotification({
        options: {
            onSuccess: () => {
                viewModalState.onOpenChange(false)
                // HAHAHAHAHA
                // new Audio('/audio/respect-++.mp3').play()
            },
        },
    })
    const { mutateAsync: deleteNotification } = useDeleteNotificationById({
        options: {
            onSuccess: () => {
                viewModalState.onOpenChange(false)
                // HAHAHAHAHA
                // new Audio('/audio/respect-++.mp3').play()
            },
        },
    })

    const handleNotificationClick = (notificationId: TEntityId) => {
        toast.promise(mutateAsync({ ids: [notificationId] }), {
            loading: 'Marking notification as read...',
            success: 'Notification marked as read',
            error: 'Failed to mark notification as read',
        })
    }

    const handleDeleteNotificationClick = (notificationId: TEntityId) => {
        toast.promise(deleteNotification(notificationId), {
            loading: 'Deleting...',
            success: 'Notification deleted',
            error: 'Failed delete notification',
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
            <NotificationInfoViewModal
                {...viewModalState}
                notification={notification}
                onDelete={() => handleDeleteNotificationClick(notification.id)}
                onView={() => handleNotificationClick(notification.id)}
            />
            <div className="relative group flex items-start gap-3 pe-3">
                <div className="size-10 relative flex-shrink-0">
                    {notification.recipient ? (
                        <>
                            <PreviewMediaWrapper
                                media={notification.recipient?.media}
                            >
                                <ImageDisplay
                                    className="size-full rounded-full object-cover"
                                    src={
                                        notification.recipient?.media
                                            ?.download_url
                                    }
                                />
                            </PreviewMediaWrapper>
                            <span className="absolute -bottom-1 -right-1 p-0.5 bg-background rounded-full">
                                <NotificationIconComponent className="size-3" />
                            </span>
                        </>
                    ) : (
                        <div className="size-full rounded-full bg-muted flex items-center justify-center">
                            <NotificationIconComponent className="size-5" />
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-1 mr-8 min-w-0">
                    <div
                        className="text-left space-y-1.5 disabled:cursor-auto cursor-pointer after:absolute after:inset-0"
                        onClick={() => {
                            viewModalState.onOpenChange(true)
                        }}
                    >
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-foreground hover:underline">
                                {notification.recipient
                                    ? notification.recipient.full_name
                                    : 'System'}
                            </p>
                            {notification.user_type && (
                                <Badge
                                    className="text-xs capitalize"
                                    variant="secondary"
                                >
                                    {notification.user_type}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                            {notification.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>
                                {toReadableDate(notification.created_at)}
                            </span>
                            <span>•</span>
                            <span>{dateAgo(notification.created_at)}</span>
                        </div>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="size-fit absolute top-1/2 -translate-y-1/2 right-0 pointer-events-auto shrink-0 p-1 z-10"
                            size="icon"
                            variant="ghost"
                        >
                            <DotsHorizontalIcon className=" opacity-0 group-hover:opacity-100" />
                            {!notification.is_viewed && (
                                <DotBigIcon className="text-primary animate-pulse" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-16">
                        <DropdownMenuItem
                            onClick={() =>
                                handleNotificationClick(notification.id)
                            }
                        >
                            <CheckFillIcon className="mr-1" /> Mark as Read
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                handleDeleteNotificationClick(notification.id)
                            }
                        >
                            <TrashIcon className="mr-1" /> Delete Notification
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default Notification
