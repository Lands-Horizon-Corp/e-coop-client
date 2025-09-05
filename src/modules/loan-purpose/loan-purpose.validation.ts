import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const LoanPurposeSchema = z.object({
    id: entityIdSchema.optional(),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    icon: z.string().min(1, 'Icon is required'),
    description: z
        .string()
        .min(5, 'A good description is ideal')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TLoanPurposeSchema = z.infer<typeof LoanPurposeSchema>
