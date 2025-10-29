import z from 'zod'

import { entityIdSchema } from '@/validation'

export const MemberProfileMediaSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.coerce
        .string()
        .min(1, 'MemberProfileMedia name is required')
        .max(255, 'Name must not exceed 255 characters'),
    description: z.coerce.string().optional(),

    member_profile_id: entityIdSchema.optional(),
    media_id: entityIdSchema.optional(),
})

export type TMemberProfileMediaSchema = z.infer<typeof MemberProfileMediaSchema>
