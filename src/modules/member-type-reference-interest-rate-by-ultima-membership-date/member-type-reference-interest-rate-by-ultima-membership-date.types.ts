import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import { entityIdSchema } from '@/validation'

import type { IMemberTypeReference } from '../member-type-reference/member-type-reference.types'

export interface IMemberTypeReferenceInterestRateByUltimaMembershipDateRequest {
    member_type_reference_id: TEntityId
    date_from?: Date
    date_to?: Date
    rate?: number
}

export interface IMemberTypeReferenceInterestRateByUltimaMembershipDateResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_type_reference_id: TEntityId
    member_type_reference?: IMemberTypeReference
    date_from: string
    date_to: string
    rate: number
}

export const memberTypeReferenceInterestRateByUltimaMembershipDateRequestSchema =
    z.object({
        member_type_reference_id: entityIdSchema,
        date_from: z.string().datetime().optional(),
        date_to: z.string().datetime().optional(),
        rate: z.number().optional(),
    })
