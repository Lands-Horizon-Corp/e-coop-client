import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IMedia } from '../media/media.types'
import { IUserBase } from '../user'
import { TimesheetRequestSchema } from './timeshee.validation'

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

export type ITimesheetInOutRequest = z.infer<typeof TimesheetRequestSchema>

export interface IPaginatedTimesheet extends IPaginatedResult<ITimesheet> {}
