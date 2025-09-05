import z from 'zod'

import { entityIdSchema } from '@/validation'

export const loanComakerMemberSchema = z.object({
    member_profile_id: entityIdSchema,
    loan_transaction_id: entityIdSchema,
    description: z.string().optional(),
    amount: z.number().optional(),
    months_count: z.number().optional(),
    year_count: z.number().optional(),
})

export type TLoanComakerMemberRequest = z.infer<typeof loanComakerMemberSchema>
