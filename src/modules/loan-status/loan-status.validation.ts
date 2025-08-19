import z from 'zod'

export const loanStatusSchema = z.object({
    name: z.string().min(1).max(255),
    icon: z.string().optional(),
    color: z.string().optional(),
    description: z.string().optional(),
})
export type TLoanStatusFormValues = z.infer<typeof loanStatusSchema>
