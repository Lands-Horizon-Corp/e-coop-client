import z from 'zod'

import { BaseEntityMetaSchema, NullableStringSchema } from '../common'

export const PermissionTemplateRequestSchema = z.object({
    name: z.string().min(1).max(255),
    description: NullableStringSchema,
    permissions: z.array(z.string()).optional(),
})

export type TPermissionTemplateRequest = z.infer<
    typeof PermissionTemplateRequestSchema
>

export const PermissionTemplateResponseSchema = BaseEntityMetaSchema.extend({
    name: z.string(),
    description: NullableStringSchema,
    permissions: z.array(z.string()),
})

export type TPermissionTemplateResponse = z.infer<
    typeof PermissionTemplateResponseSchema
>
