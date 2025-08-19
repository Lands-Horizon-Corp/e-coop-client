import z from 'zod'

import { entityIdSchema } from '@/validation'

export const CategorySchema = z.object({
    id: entityIdSchema,
    name: z.string(),
    description: z.string().optional(),
})
export type TCategoryFormValues = z.infer<typeof CategorySchema>
