import { TEntityId } from '../common'

export type TNotificationPriority = 'low' | 'medium' | 'high'

export type TNotification = 'success' | 'error' | 'warning' | 'info'

export interface INotification {
    id: TEntityId
    type: TNotification
    message: string
    title?: string
    createdAt?: string
    actionUrl?: string
    priority?: TNotificationPriority
    duration?: number
    read: boolean
    userId?: TEntityId | null
    category?: string
}
