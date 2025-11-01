import z from 'zod'

import { PercentageSchema, entityIdSchema } from '@/validation'

export const timeDepositComputationSchema = z
    .object({
        id: entityIdSchema.optional(), // dont worry this is set by server
        time_deposit_type_id: entityIdSchema.optional(), // set by server

        minimum_amount: z.coerce.number(),
        maximum_amount: z.coerce.number(),
        header_1: PercentageSchema,
        header_2: PercentageSchema,
        header_3: PercentageSchema,
        header_4: PercentageSchema,
        header_5: PercentageSchema,
        header_6: PercentageSchema,
        header_7: PercentageSchema,
        header_8: PercentageSchema,
        header_9: PercentageSchema,
        header_10: PercentageSchema,
        header_11: PercentageSchema,
    })
    .refine(
        ({ minimum_amount, maximum_amount }) => minimum_amount < maximum_amount,
        {
            path: ['minimum_amount'],
            error: 'Minimum amount must be less than Maximum amount',
        }
    )

export type TTimeDepositComputationSchema = z.infer<
    typeof timeDepositComputationSchema
>
