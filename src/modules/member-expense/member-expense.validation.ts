import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const MemberExpenseSchema = z.object({
    id: entityIdSchema.optional(),
    member_profile_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    name: z.string().min(1, 'Expense name is required'),
    amount: z.coerce.number(),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
})
