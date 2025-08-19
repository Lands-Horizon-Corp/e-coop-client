import { IPaginatedResult, ITimeStamps, TEntityId } from '@/types/common'

import { IUserBase } from '../user/user.types'

export type INotificationType =
    | 'success'
    | 'warning'
    | 'info'
    | 'error'
    | 'general'
    | 'report'

export interface INotification extends ITimeStamps {
    id: TEntityId

    user_id: TEntityId
    user: IUserBase

    title: string
    description: string
    is_viewed: boolean

    notification_type: INotificationType
}

export interface INotificationPaginated
    extends IPaginatedResult<INotification> {}
