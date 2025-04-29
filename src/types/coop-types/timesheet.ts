import { TEntityId } from '../common'
import { IMedia } from './media'

export interface ITimeInRequest {
    timeIn: Date
    mediaIn: IMedia
}

export interface ITimeOutRequest {
    timeOut: Date
    mediaOut: IMedia
}

export interface ITimesheet {
    id: TEntityId
    employeeId: number
    timeIn: Date
    timeOut?: Date
    mediaInId?: number
    mediaOutId?: number
    createdAt: Date
    updatedAt: Date
    mediaIn?: IMedia
    mediaOut?: IMedia
}
