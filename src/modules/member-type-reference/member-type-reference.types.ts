import z from 'zod'

import { IAccount } from '../account'
import {
    IBaseEntityMeta,
    IPaginatedResult,
    TEntityId,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'
import { IMemberType } from '../member-type/member-type.types'

// LATEST FROM ERD
export interface IMemberTypeReferenceRequest {
    id?: TEntityId

    branch_id?: TEntityId
    organization_id?: TEntityId

    account_id: TEntityId
    member_type_id: TEntityId

    charges: number
    description: string
    interest_rate: number
    minimum_balance: number
    maintaining_balance: number
    active_member_ratio: number
    active_member_minimum_balance: number

    other_interest_on_saving_computation_minimum_balance: number
    other_interest_on_saving_computation_interest_rate: number
}

// LATEST FROM ERD
export interface IMemberTypeReference extends IBaseEntityMeta {
    id: TEntityId

    account_id: TEntityId
    account: IAccount

    member_type_id: TEntityId
    member_type: IMemberType

    maintaining_balance: number
    description: string
    interest_rate: number
    minimum_balance: number
    charges: number
    active_member_minimum_balance: number
    active_member_ratio: number

    other_interest_on_saving_computation_minimum_balance: number
    other_interest_on_saving_computation_interest_rate: number
}

export interface IMemberTypeReferencePaginated
    extends IPaginatedResult<IMemberTypeReference> {}

export const memberTypeReferenceSchema = z.object({
    id: entityIdSchema.optional(),

    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    account_id: entityIdSchema,
    account: z.any(),
    member_type_id: entityIdSchema,

    interest_rate: z.coerce.number().min(0, 'Interest rate is required'),
    charges: z.coerce.number().min(0, 'Charges are required'),

    minimum_balance: z.coerce.number().min(0, 'Minimum balance is required'),
    maintaining_balance: z.coerce
        .number()
        .min(0, 'Maintaining balance is required'),

    active_member_ratio: z.coerce.number().min(0),
    active_member_minimum_balance: z.coerce.number().min(0),

    other_interest_on_saving_computation_minimum_balance: z.coerce
        .number()
        .min(0),
    other_interest_on_saving_computation_interest_rate: z.coerce
        .number()
        .min(0),
})
