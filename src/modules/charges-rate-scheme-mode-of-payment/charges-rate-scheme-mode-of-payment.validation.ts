import z from 'zod'

import { PercentageSchema, entityIdSchema } from '@/validation'

export const ChargesRateSchemeModeOfPaymentSchema = z
    .object({
        id: entityIdSchema.optional(),
        from: z.coerce.number(),
        to: z.coerce.number(),
        column1: PercentageSchema.optional(),
        column2: PercentageSchema.optional(),
        column3: PercentageSchema.optional(),
        column4: PercentageSchema.optional(),
        column5: PercentageSchema.optional(),
        column6: PercentageSchema.optional(),
        column7: PercentageSchema.optional(),
        column8: PercentageSchema.optional(),
        column9: PercentageSchema.optional(),
        column10: PercentageSchema.optional(),
        column11: PercentageSchema.optional(),
        column12: PercentageSchema.optional(),
        column13: PercentageSchema.optional(),
        column14: PercentageSchema.optional(),
        column15: PercentageSchema.optional(),
        column16: PercentageSchema.optional(),
        column17: PercentageSchema.optional(),
        column18: PercentageSchema.optional(),
        column19: PercentageSchema.optional(),
        column20: PercentageSchema.optional(),
        column21: PercentageSchema.optional(),
        column22: PercentageSchema.optional(),
    })
    .refine(
        (data) => {
            return data.from < data.to
        },
        {
            path: ['from'],
            error: 'From should not be greater than or equal to To',
        }
    )

export type TChargesRateSchemeModeOfPaymentSchema = z.infer<
    typeof ChargesRateSchemeModeOfPaymentSchema
>
