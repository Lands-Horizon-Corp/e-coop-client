import z from 'zod'
import { entityIdSchema } from '@/validations/common'

export const memberRelativeAccountsSchema = z.object({
    membersProfileId: entityIdSchema.optional(),
    relativeProfileMemberId: entityIdSchema,
    familyRelationship: z.string().min(1, 'Family relationship is required'),
    description: z.string().min(1, 'Description is required'),
})
