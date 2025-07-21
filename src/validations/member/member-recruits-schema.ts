import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validations/common'

export const memberRecruitsSchema = z.object({
    id: entityIdSchema.optional(),
    membersProfileId: entityIdSchema.optional(),
    membersProfileRecruitedId: entityIdSchema,
    dateRecruited: z.string().min(1, 'Date recruited is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    name: z.string().min(1, 'Name is required'),
})
