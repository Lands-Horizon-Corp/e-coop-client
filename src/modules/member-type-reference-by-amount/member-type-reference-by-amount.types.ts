import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import { entityIdSchema } from '@/validation'

export interface IMemberTypeReferenceByAmountRequest {
    member_type_reference_id: TEntityId
    from?: number
    to?: number
    rate?: number
}

export interface IMemberTypeReferenceByAmountResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_type_reference_id: TEntityId
    member_type_reference?: IMemberTypeReferenceByAmountResponse
    from: number
    to: number
    rate: number
}

export const memberTypeReferenceByAmountRequestSchema = z.object({
    member_type_reference_id: entityIdSchema,
    from: z.number().optional(),
    to: z.number().optional(),
    rate: z.number().optional(),
})
