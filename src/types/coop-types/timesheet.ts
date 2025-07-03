import {
    IBaseEntityMeta,
    IMedia,
    IPaginatedResult,
    IUserBase,
    TEntityId,
} from '@/types'

export interface ITimesheet extends IBaseEntityMeta {
    user_id: TEntityId
    user?: IUserBase

    media_in_id?: TEntityId
    media_in?: IMedia

    media_out_id?: TEntityId
    media_out?: IMedia

    time_in: string
    time_out?: string
}

export interface ITimesheetRequest {
    id?: TEntityId
    user_id?: TEntityId

    media_in_id?: TEntityId
    media_out_id?: TEntityId

    time_in: string
    time_out?: string
}

export interface ITimesheetInOutRequest {
    media_id?: TEntityId
}

export interface IPaginatedTimesheet extends IPaginatedResult<ITimesheet> {}
