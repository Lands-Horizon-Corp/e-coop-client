import z from 'zod'

import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export interface IMemberCenterRequest {
    id?: TEntityId
    name: string
    description: string
}

export interface IMemberCenter extends ITimeStamps, IAuditable {
    id: TEntityId

    name: string
    description: string
}

export interface IMemberCenterPaginated
    extends IPaginatedResult<IMemberCenter> {}

export const memberCenterSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
