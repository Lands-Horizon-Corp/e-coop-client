import z from 'zod'

import {
    IBaseEntityMeta,
    IPaginatedResult,
    TEntityId,
    TTagCategory,
} from '@/types/common'
import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validation'

export interface IAccountTag extends IBaseEntityMeta {
    account_id: TEntityId

    name: string
    description: string
    category: TTagCategory
    color: string
    icon: string
}

export interface IAccounTagRequest {
    account_id: TEntityId
    name: string
    description?: string
    category: TTagCategory
    color?: string
    icon?: string
}

export interface IAccountTagPaginated extends IPaginatedResult<IAccountTag> {}

export const AccountTagSchema = z.object({
    account_id: z.string().min(1, 'Account is required'),
    account: z.any().optional(),
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    category: z
        .string()
        .min(1, 'Category is required') as z.ZodType<TTagCategory>,
    color: z.string().optional(),
    icon: z.string().optional(),
})

export type AccountTagFormValues = z.infer<typeof AccountTagSchema>
