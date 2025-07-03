import z from 'zod'

import { entityIdSchema } from '@/validations/common'

export const memberRecruitsSchema = z.object({
    id: entityIdSchema.optional(),
    membersProfileId: entityIdSchema.optional(),
    membersProfileRecruitedId: entityIdSchema,
    dateRecruited: z.string().min(1, 'Date recruited is required'),
    description: z.string().min(1, 'Description is required'),
    name: z.string().min(1, 'Name is required'),
})
