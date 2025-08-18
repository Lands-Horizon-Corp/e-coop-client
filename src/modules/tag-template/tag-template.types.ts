import z from 'zod'

import { TAG_CATEGORY } from '@/constants'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '../common'
import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export type TTagCategory = (typeof TAG_CATEGORY)[number]

export interface ITagTemplate extends IBaseEntityMeta {
    name: string
    description?: string

    category: TTagCategory

    color: string
    icon: string // when using this interface please type cast nlng to TIcon
}

export interface ITagTemplateRequest {
    id?: TEntityId

    name: string
    description?: string

    category: TTagCategory

    color: string
    icon: string
}

export interface ITagTemplatePaginated extends IPaginatedResult<ITagTemplate> {}

export const tagTemplateSchema = z.object({
    name: z.string().min(1, 'Name is required'),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    category: z.enum(TAG_CATEGORY, {
        message: 'Category is required',
    }),
    color: z.string().min(1, 'Color is required'),
    icon: z.string().min(1, 'Icon is required'),
})
