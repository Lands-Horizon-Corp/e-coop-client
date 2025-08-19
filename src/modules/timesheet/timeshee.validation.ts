import z from 'zod'

import { entityIdSchema } from '@/validation'

export const timesheetRequestSchema = z.object({
    media_id: entityIdSchema.optional(),
})
