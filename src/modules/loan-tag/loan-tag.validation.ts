import z from 'zod'

import { entityIdSchema } from '@/validation'

export const loanTagSchema = z.object({
    loan_transaction_id: entityIdSchema,
    name: z.string().min(1).max(50),
    description: z.string().optional(),
    category: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
})
export type TLoanTagFormValues = z.infer<typeof loanTagSchema>
