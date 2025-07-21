import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validations/common'

export const memberRelativeAccountsSchema = z.object({
    membersProfileId: entityIdSchema.optional(),
    relativeProfileMemberId: entityIdSchema,
    familyRelationship: z.string().min(1, 'Family relationship is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
