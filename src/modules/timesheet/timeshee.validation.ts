import z from 'zod'

import { entityIdSchema } from '@/validation'

export const TimesheetRequestSchema = z.object({
    media_id: entityIdSchema.optional(),
})
