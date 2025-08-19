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
} from '@/validation'

export interface IAccountCategory extends IAuditable, ITimeStamps {
    id: TEntityId

    name: string
    description?: string

    organization_id: TEntityId
    branch_id: TEntityId
}

export interface IAccountCategoryRequest {
    name: string
    description?: string

    organization_id?: TEntityId
    branch_id?: TEntityId
}

export interface IAccountCategoryPaginated
    extends IPaginatedResult<IAccountCategory> {}

export const AccountCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type AccountCategoryFormValues = z.infer<typeof AccountCategorySchema>
