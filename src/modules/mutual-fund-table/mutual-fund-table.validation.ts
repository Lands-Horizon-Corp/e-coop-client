import z from 'zod'

import { entityIdSchema } from '@/validation'

export const MutualFundTableSchema = z
    .object({
        id: entityIdSchema.optional(),

        months_from: z.number().int().min(0),
        months_to: z.number().int().min(0),
        amount: z.number().min(0),
    })
    .superRefine((data, ctx) => {
        if (data.months_from > data.months_to) {
            ctx.addIssue({
                code: 'custom',
                path: ['months_from'],
                message: 'Months from should not be greater than months to',
            })
        }
    })

export type TMutualFundTableSchema = z.infer<typeof MutualFundTableSchema>
