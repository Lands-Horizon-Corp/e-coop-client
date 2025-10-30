import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IUser } from '../user'
import { NOTIFICATION_TYPE } from './notification.constant'
import { NotificationSchema } from './notification.validation'

export type TNotificationType = (typeof NOTIFICATION_TYPE)[number]

export interface INotification extends IBaseEntityMeta {
    [x: string]: any
    user_id: TEntityId
    user: IUser
    title: string
    description: string
    is_viewed: boolean
    notification_type: TNotificationType
}

export type INotificationRequest = z.infer<typeof NotificationSchema>

export interface INotificationPaginated
    extends IPaginatedResult<INotification> {}

export type INotificationViewRequest = { ids: TEntityId[] }
