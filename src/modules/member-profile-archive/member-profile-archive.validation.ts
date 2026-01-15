import z from 'zod'

import { entityIdSchema } from '@/validation'

export const MemberProfileArchiveSchema = z.object({
    id: entityIdSchema,
    name: z.coerce
        .string()
        .min(1, 'MemberProfileArchive name is required')
        .max(255, 'Name must not exceed 255 characters'),
    description: z.coerce.string().optional(),

    member_profile_id: entityIdSchema.optional(),
    media_id: entityIdSchema.optional(),
    category: z.coerce.string(),
})

export type TMemberProfileArchiveSchema = z.infer<
    typeof MemberProfileArchiveSchema
>

export const MemberProfileArchiveBulkUpdateSchema = z.object({
    ids: z.array(entityIdSchema).min(1, 'At least one file must be uploaded'),
    category: z.coerce.string().min(1, 'Category is required'),
})

export type TMemberProfileArchiveBulkUpdateSchema = z.infer<
    typeof MemberProfileArchiveBulkUpdateSchema
>
