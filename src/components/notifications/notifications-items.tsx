import { useState } from 'react'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '../ui/button'
import { CheckIcon, OptionsIcon, TrashIcon } from '../icons'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { INotificationResource, TEntityId } from '@/types/coop-types'
import NotificationTypeComponent from '../notification-type'

interface INotificationsItemsProps {
    className?: string
    data: INotificationResource
    handleDeleteNotification: (id: TEntityId) => void
    handleMarkItemAsRead: (id: TEntityId) => void
}

const NotificationsItems = ({
    data,
    className,
    handleDeleteNotification,
    handleMarkItemAsRead,
}: INotificationsItemsProps) => {
    const [hoveredId, setHoveredId] = useState<TEntityId | null>(null)
    const [openPopoverId, setOpenPopoverId] = useState<TEntityId | null>(null)

    const handlePopoverToggle = (id: TEntityId) => {
        setOpenPopoverId((prevId) => (prevId === id ? null : id))
    }

    return (
        <a
            href={data.actionUrl}
            onMouseOver={() => setHoveredId(data.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
                'relative flex h-24 w-full cursor-pointer space-x-4 rounded-lg p-4 hover:bg-secondary dark:hover:bg-[#313135]',
                className
            )}
        >
            <div>
                <NotificationTypeComponent
                    IconClassName="text-xl dark:opacity-50 opacity-80"
                    className="flex rounded-full bg-muted p-5"
                    type={data.type}
                />
            </div>

            <div
                className={cn(
                    'grow flex-col justify-center',
                    data.read
                        ? 'text-muted-foreground'
                        : 'text-accent-foreground'
                )}
            >
                <h4 className="text-sm">
                    {data.title || 'Untitled Notification'}
                </h4>
                <p className="text-xs">{data.message}</p>
                <p
                    className={cn(
                        'text-[10px]',
                        !data.read ? 'text-primary' : ''
                    )}
                >
                    {toReadableDate(data.createdAt ?? '')}
                </p>
            </div>
            <div className="mr-16 flex h-full items-center justify-center">
                {(hoveredId === data.id || openPopoverId === data.id) && (
                    <Popover
                        open={openPopoverId === data.id}
                        onOpenChange={() => handlePopoverToggle(data.id)}
                    >
                        <PopoverTrigger asChild>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    handlePopoverToggle(data.id)
                                }}
                                aria-expanded={openPopoverId === data.id}
                                className={cn(
                                    'cursor-pointer rounded-full p-2 text-[#222225] hover:bg-white dark:text-accent-foreground dark:hover:border dark:hover:bg-[#303033] dark:hover:bg-secondary',
                                    openPopoverId === data.id
                                        ? 'bg-secondary dark:bg-[#35353a]'
                                        : 'bg-transparent'
                                )}
                            >
                                <OptionsIcon />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            className="border-0 p-0 shadow-lg dark:bg-[#27272b]"
                        >
                            <div className="flex flex-col">
                                {!data.read && (
                                    <Button
                                        onClick={() => {
                                            handleMarkItemAsRead(data.id)
                                            handlePopoverToggle(data.id)
                                            setHoveredId(null)
                                        }}
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start space-x-2 rounded-b-none border-0 bg-transparent text-xs dark:hover:bg-[#35353a]'
                                        )}
                                    >
                                        <CheckIcon size={19} />
                                        <span>Mark as read</span>
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start space-x-2 rounded-t-none border-0 bg-transparent text-xs dark:hover:bg-[#35353a]'
                                    )}
                                    onClick={() =>
                                        handleDeleteNotification(data.id)
                                    }
                                >
                                    <TrashIcon size={19} />
                                    <span>Delete this notification</span>
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
            <div className="flex-none" />

            {!data.read && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 transform">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                </span>
            )}
        </a>
    )
}

export default NotificationsItems
