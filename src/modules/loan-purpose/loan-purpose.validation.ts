import z from 'zod'

export const loanPurposeSchema = z.object({
    description: z.string().optional(),
    icon: z.string().optional(),
})

export type TLoanPurposeFormValues = z.infer<typeof loanPurposeSchema>
