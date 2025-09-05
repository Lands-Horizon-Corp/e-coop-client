import z from 'zod'

import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IBranch } from '../branch'
import { MemberOccupationSchema } from './member-occupation.validation'

export interface IMemberOccupation extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    name: string
    description: string
}

export type IMemberOccupationRequest = z.infer<typeof MemberOccupationSchema>

export interface IMemberOccupationPaginated
    extends IPaginatedResult<IMemberOccupation> {}
