import z from 'zod'

export const loanGuaranteedFundSchema = z.object({
    scheme_number: z.number(),
    increasing_rate: z.number(),
})
export type TLoanGuaranteedFormValues = z.infer<typeof loanGuaranteedFundSchema>
