import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import { entityIdSchema } from '@/validation'

import { IMemberTypeReference } from '../member-type-reference/member-type-reference.types'

export interface IMemberTypeReferenceInterestRateByUltimaMembershipDatePerYearRequest {
    member_type_reference_id: TEntityId
    year_from?: number
    year_to?: number
    rate?: number
}

export interface IMemberTypeReferenceInterestRateByUltimaMembershipDatePerYearResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_type_reference_id: TEntityId
    member_type_reference?: IMemberTypeReference
    year_from: number
    year_to: number
    rate: number
}

export const memberTypeReferenceInterestRateByUltimaMembershipDatePerYearRequestSchema =
    z.object({
        member_type_reference_id: entityIdSchema,
        year_from: z.number().optional(),
        year_to: z.number().optional(),
        rate: z.number().optional(),
    })
