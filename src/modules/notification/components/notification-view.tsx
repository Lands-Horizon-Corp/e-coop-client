import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'

import {
    CheckFillIcon,
    DotBigIcon,
    DotsHorizontalIcon,
    TrashIcon,
    UserIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { INotification } from '../notification.types'
import { getNotificationIcon } from './notification'

type NotificationInfoViewProps = {
    notification: INotification
    onView?: () => void
    onDelete?: () => void
}

export const NotificationInfoView = ({
    notification,
    onView,
    onDelete,
}: NotificationInfoViewProps) => {
    const recipientFullName = notification.recipient
        ? `${notification.recipient.first_name || ''} ${notification.recipient.middle_name || ''} ${notification.recipient.last_name || ''}`.trim()
        : ''

    const NotificationIconComponent = getNotificationIcon(
        notification.notification_type
    )

    return (
        <div className="space-y-0 relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="size-fit absolute top-0 right-0 pointer-events-auto shrink-0 p-1 z-10"
                        size="icon"
                        variant="ghost"
                    >
                        <DotsHorizontalIcon />
                        {!notification.is_viewed && (
                            <DotBigIcon className="text-primary animate-pulse" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-16">
                    <DropdownMenuItem onClick={() => onView?.()}>
                        <CheckFillIcon className="mr-1" /> Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.()}>
                        <TrashIcon className="mr-1" /> Delete Notification
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* User Header Section */}
            <div className="flex items-start gap-4 pb-4">
                {/* User Avatar */}
                {notification.recipient?.media?.download_url ? (
                    <PreviewMediaWrapper media={notification.recipient.media}>
                        <ImageDisplay
                            className="size-16 rounded-full object-cover ring-2 ring-border"
                            src={notification.recipient.media.download_url}
                        />
                    </PreviewMediaWrapper>
                ) : notification.recipient ? (
                    <div className="size-16 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">
                        <UserIcon className="size-8 text-muted-foreground" />
                    </div>
                ) : null}

                {/* User Info */}
                {notification.recipient && (
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                            {recipientFullName || 'Unknown User'}
                        </h3>
                        {notification.user_type && (
                            <Badge
                                className="mt-1 capitalize bg-primary/10 text-primary hover:bg-primary/20"
                                variant="secondary"
                            >
                                {notification.user_type}
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Notification Title - Truncated */}
            <div className="pb-3">
                <h2 className="font-bold text-foreground line-clamp-2">
                    <NotificationIconComponent className="size-5 inline mr-1" />
                    {notification.title}
                </h2>
            </div>

            {/* Date and Time */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pb-4">
                <span>
                    {toReadableDateTime(notification.created_at)} -{' '}
                    {dateAgo(notification.created_at)}
                </span>
            </div>

            {/* Notification Description */}
            <div>
                <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                        {notification.description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export const NotificationInfoViewModal = ({
    title = 'Notification Details',
    description,
    className,
    notification,
    onView,
    onDelete,
    ...props
}: IModalProps & NotificationInfoViewProps) => {
    return (
        <Modal
            className={cn('max-w-2xl', className)}
            description={description}
            title={title}
            {...props}
            closeButtonClassName="hidden"
            descriptionClassName="hidden"
            titleClassName="hidden"
        >
            <NotificationInfoView
                notification={notification}
                onDelete={onDelete}
                onView={onView}
            />
        </Modal>
    )
}
