import { z } from 'zod'

export const createGenderSchema = z.object({
    name: z.string().min(1, 'Gender name is required'),
    description: z.string().optional(),
})
