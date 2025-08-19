import z from 'zod'

import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

export const AutomaticLoanDeductionSchema = z.object({
    loan_id: entityIdSchema,
    member_id: entityIdSchema,
    deduction_amount: z
        .number()
        .positive('Deduction must be greater than zero')
        .max(500000000, 'Deduction cannot exceed Five Hundred Million'),
    deduction_date: stringDateWithTransformSchema,
    is_posted: z.boolean().default(false),
})
