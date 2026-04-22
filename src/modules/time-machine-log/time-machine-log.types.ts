import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IUser } from '../user'
import { IUserOrganization } from '../user-organization'
import {
    TimeMachineCancelSchema,
    TimeMachineLogSchema,
} from './time-machine-log.validation'

export const TIME_MACHINE_LOG_STATUS = [
    'active',
    'inactive',
    'revoked',
] as const

export type TTimeMachineLogStatus = (typeof TIME_MACHINE_LOG_STATUS)[number]

export interface ITimeMachineLog extends IBaseEntityMeta {
    user_organization_id: TEntityId
    user_organization: IUserOrganization

    user_id?: TEntityId
    user?: IUser

    timezone: string

    frozen_at: string
    frozen_until: string

    status?: TTimeMachineLogStatus
    description?: string

    reason?: string
    is_active?: boolean
}

export type TTimeMachineCancelRequest = z.infer<typeof TimeMachineCancelSchema>

export type TTimeMachineLogRequest = z.infer<typeof TimeMachineLogSchema>

export interface ITimeMachineLogPaginated extends IPaginatedResult<ITimeMachineLog> {}
