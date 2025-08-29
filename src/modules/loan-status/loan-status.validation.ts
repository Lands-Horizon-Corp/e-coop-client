import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const LoanStatusSchema = z.object({
    id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    name: z.string().min(1, 'Loan status name is required'),
    icon: z.string(),
    color: z.string(),
    description: z
        .string()
        .min(5, 'Loan status description must be descriptive')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TLoanStatusSchema = z.infer<typeof LoanStatusSchema>
