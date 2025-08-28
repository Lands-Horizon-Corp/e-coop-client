import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const MemberContactReferenceSchema = z.object({
    id: z.string().optional(),
    member_profile_id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    contact_number: z.string().min(1, 'Contact number is required'),
})
