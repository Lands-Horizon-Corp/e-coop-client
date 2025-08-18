import { z } from 'zod'

import { CategoryBaseSchema } from '../category/category.types'
import {
    NullableentityIdSchema,
    TimeStampSchema,
    entityIdSchema,
} from '../common'

export const OrganizationCategoryBaseSchema = z.object({
    organization_id: NullableentityIdSchema,
    category_id: entityIdSchema,
})
export type TOrganizationCategoryBase = z.infer<
    typeof OrganizationCategoryBaseSchema
>

export const OrganizationCategoryResponseSchema =
    OrganizationCategoryBaseSchema.extend({
        id: entityIdSchema,
        category: CategoryBaseSchema.optional(),
    }).extend(TimeStampSchema.omit({ deleted_at: true }))

export type OrganizationCategoryResponse = z.infer<
    typeof OrganizationCategoryResponseSchema
>

export const OrganizationCategoryRequestSchema =
    OrganizationCategoryBaseSchema.extend({
        id: entityIdSchema.optional(),
    })

export type OrganizationCategoryRequest = z.infer<
    typeof OrganizationCategoryRequestSchema
>
