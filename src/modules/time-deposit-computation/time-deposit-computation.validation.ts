import z from 'zod'

export const timeDepositComputationSchema = z.object({
    name: z.string(),

    minimum_amount: z.number().optional(),
    maximum_amount: z.number().optional(),
    header1: z.number().optional(),
    header2: z.number().optional(),
    header3: z.number().optional(),
    header4: z.number().optional(),
    header5: z.number().optional(),
    header6: z.number().optional(),
    header7: z.number().optional(),
    header8: z.number().optional(),
    header9: z.number().optional(),
    header10: z.number().optional(),
    header11: z.number().optional(),
})

export type TTimeDepositComputationFormValues = z.infer<
    typeof timeDepositComputationSchema
>
