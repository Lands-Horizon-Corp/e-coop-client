import z from 'zod'

import { ICONS } from '@/constants'
import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const LoanTagSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Loan Tag name is required'),
    description: z
        .string()
        .min(10, 'Min 5 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),

    color: z.coerce.string().min(1, 'Color is required'),
    icon: z.enum(ICONS),
})

export type TLoanTagSchema = z.infer<typeof LoanTagSchema>
