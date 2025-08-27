import z from 'zod'

export const GeneralLedgerAccountsGroupingSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(1024).optional(),

    //   debit: AccountingPrincipleTypeSchema,
    //   credit: AccountingPrincipleTypeSchema,

    from_code: z.number().int().nonnegative().optional(),
    to_code: z.number().int().nonnegative().optional(),
})
export type TGeneralLedgerAccountsGroupingFormValues = z.infer<
    typeof GeneralLedgerAccountsGroupingSchema
>
