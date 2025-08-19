import z from 'zod'

import { descriptionSchema } from '@/validation'

export const collateralSchema = z.object({
    icon: z.string().optional(),
    name: z.string().min(1).max(255),
    description: descriptionSchema.optional(),
})
export type TCollateralFormValues = z.infer<typeof collateralSchema>
