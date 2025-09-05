import z from 'zod'

import {
    dateToISOTransformer,
    descriptionTransformerSanitizer,
    entityIdSchema,
    stringDateSchema,
} from '@/validation'

export const MemberGovernmentBenefitSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),

    member_profile_id: entityIdSchema,
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),

    country_code: z.string().min(1, 'Country is required'),
    value: z.string().min(1, 'Value is required'),
    expiry_date: stringDateSchema.transform(dateToISOTransformer),
    description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    front_media_id: entityIdSchema.optional(),
    front_media: z.any(),
    back_media_id: entityIdSchema.optional(),
    back_media: z.any(),
})
