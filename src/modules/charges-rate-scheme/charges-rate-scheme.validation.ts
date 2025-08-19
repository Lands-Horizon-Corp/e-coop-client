import z from 'zod'

import { descriptionSchema, entityIdSchema } from '@/validation'

export const chargesRateSchemeSchema = z.object({
    charges_rate_by_term_header_id: entityIdSchema.optional(),
    charges_rate_member_type_mode_of_payment_id: entityIdSchema.optional(),
    name: z.string().min(1).max(255),
    description: descriptionSchema,
})
export type ChargesRateFromValues = z.infer<typeof chargesRateSchemeSchema>
