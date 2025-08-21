import z from 'zod'

import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IBranch } from '../branch'
import { MemberTypeSchema } from './member-type.validation'

export interface IMemberType extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    name: string
    prefix: string
    description: string
}

export type IMemberTypeRequest = z.infer<typeof MemberTypeSchema>

export interface IMemberTypePaginated extends IPaginatedResult<IMemberType> {}
