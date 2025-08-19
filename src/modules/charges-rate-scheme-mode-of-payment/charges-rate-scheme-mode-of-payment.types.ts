import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import { descriptionSchema, entityIdSchema } from '@/validation'

export interface IChargesRateMemberTypeModeOfPaymentRequest {
    member_type_id: TEntityId
    mode_of_payment?: string
    name?: string
    description?: string
}

export interface IChargesRateMemberTypeModeOfPaymentResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_type_id: TEntityId
    member_type?: {
        id: TEntityId
        name: string
    }
    mode_of_payment: string
    name: string
    description: string
}

const modeOfPaymentSchema = z.string().optional()

export const chargesRateMemberTypeModeOfPaymentRequestSchema = z.object({
    member_type_id: entityIdSchema.min(1, 'Member Type ID is required'),
    mode_of_payment: modeOfPaymentSchema,
    name: z.string().optional(),
    description: descriptionSchema.optional(),
})
