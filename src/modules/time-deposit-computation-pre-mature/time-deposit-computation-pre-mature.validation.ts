import z from 'zod'

import { PercentageSchema, entityIdSchema } from '@/validation'

export const TimeDepositComputationPreMatureSchema = z
    .object({
        id: entityIdSchema.optional(), // set by server as indicator for update/already saved
        time_deposit_type_id: entityIdSchema.optional(), // this is set by server
        time_deposit_type: z.any().optional(), // this is set by server
        terms: z.coerce.number().nonnegative(),
        from: z.coerce.number(),
        to: z.coerce.number(),
        rate: PercentageSchema,
    })
    .refine(({ from, to }) => from < to, {
        path: ['from'],
        error: 'From must not greater than to',
    })

export type TTimeDepositComputationPreMatureSchema = z.infer<
    typeof TimeDepositComputationPreMatureSchema
>
