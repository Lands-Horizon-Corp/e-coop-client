import { IUserBase } from '../auth/user'
import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../coop-types'

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
