import z from 'zod'

import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { MemberCenterSchema } from './member-center.validation'

export type IMemberCenterRequest = z.infer<typeof MemberCenterSchema>

export interface IMemberCenter extends ITimeStamps, IAuditable {
    id: TEntityId

    name: string
    description: string
}

export interface IMemberCenterPaginated
    extends IPaginatedResult<IMemberCenter> {}
