import z from 'zod'

import { entityIdSchema } from '@/validation'

export const AreaSchema = z.object({
    id: entityIdSchema.optional(),

    media_id: entityIdSchema.optional(),
    media: z.any(), // For displaying

    name: entityIdSchema.optional(),

    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
})

export type TAreaSchema = z.infer<typeof AreaSchema>
