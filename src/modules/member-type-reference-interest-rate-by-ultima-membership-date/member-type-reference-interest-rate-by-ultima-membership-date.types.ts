import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

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
    member_type_reference?: {}
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
