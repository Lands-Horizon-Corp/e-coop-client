import z from 'zod'
import { entityIdSchema, mediaSchema } from '@/validations/common'

export const memberJointAccountsSchema = z.object({
    id: entityIdSchema.optional(),
    description: z.string().min(1, 'Description is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    suffix: z.string().optional(),

    middleName: z.string().optional(),
    familyRelationship: z.string().optional(),

    // new properties
    mediaId: entityIdSchema.optional(),
    media: mediaSchema.optional(),
    signatureMediaId: entityIdSchema.optional(),
    signatureMedia: mediaSchema.optional(),
})
