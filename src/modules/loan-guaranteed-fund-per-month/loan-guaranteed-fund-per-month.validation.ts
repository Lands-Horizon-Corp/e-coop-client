import z from 'zod'

export const loanGuaranteedFundPerMonthSchema = z.object({
    month: z.number().optional(),
    loan_guaranteed_fund: z.number().optional(),
})
export type TLoanGuaranteedFundPerMonthFormValues = z.infer<
    typeof loanGuaranteedFundPerMonthSchema
>
