import z from 'zod'

export const timeDepositTypeSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    pre_mature: z.number().optional(),
    pre_mature_rate: z.number().optional(),
    excess: z.number().optional(),
    header_1: z.number().optional(),
    header_2: z.number().optional(),
    header_3: z.number().optional(),
    header_4: z.number().optional(),
    header_5: z.number().optional(),
    header_6: z.number().optional(),
    header_7: z.number().optional(),
    header_8: z.number().optional(),
    header_9: z.number().optional(),
    header_10: z.number().optional(),
    header_11: z.number().optional(),
})
export type TTimeDepositTypeFormValues = z.infer<typeof timeDepositTypeSchema>
