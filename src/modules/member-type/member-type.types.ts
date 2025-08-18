import z from 'zod'

import { IBranch } from '../branch'
import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export interface IMemberTypeRequest {
    id?: TEntityId
    branch_id?: IBranch // IDK if this should be optional and server auto add this?

    name: string
    prefix: string
    description: string
}

export interface IMemberType extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    name: string
    prefix: string
    description: string
}

export interface IMemberTypePaginated extends IPaginatedResult<IMemberType> {}

export const createMemberTypeSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    prefix: z.string().min(1, 'Prefix is required').max(3, 'Max 3 characters'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
