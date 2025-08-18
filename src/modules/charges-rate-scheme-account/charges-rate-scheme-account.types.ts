import z from 'zod'

import { IAccount } from '../account'
import { ChargesRateByTermHeaderRequest } from '../charges-rate-by-term-header'
import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    descriptionSchema,
    entityIdSchema,
} from '../common'

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

export interface IChargesRateSchemeRequest {
    charges_rate_by_term_header_id?: TEntityId
    charges_rate_member_type_mode_of_payment_id?: TEntityId
    name: string
    description: string
}

export interface IChargesRateSchemeResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    charges_rate_by_term_header_id: TEntityId
    charges_rate_by_term_header?: ChargesRateByTermHeaderRequest
    charges_rate_member_type_mode_of_payment_id: TEntityId
    charges_rate_member_type_mode_of_payment?: IChargesRateMemberTypeModeOfPaymentResponse
    name: string
    description: string
}

export const chargesRateSchemeRequestSchema = z.object({
    charges_rate_by_term_header_id: entityIdSchema.optional(),
    charges_rate_member_type_mode_of_payment_id: entityIdSchema.optional(),
    name: z.string().min(1).max(255),
    description: descriptionSchema,
})

export interface IChargesRateSchemeAccountRequest {
    charges_rate_scheme_id: TEntityId
    account_id: TEntityId
}

export interface IChargesRateSchemeAccountResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    charges_rate_scheme_id: TEntityId
    charges_rate_scheme?: IChargesRateSchemeResponse
    account_id: TEntityId
    account?: IAccount
}

export const chargesRateSchemeAccountRequestSchema = z.object({
    charges_rate_scheme_id: entityIdSchema.min(
        1,
        'Charges Rate Scheme ID is required'
    ),
    account_id: entityIdSchema.min(1, 'Account ID is required'),
})
