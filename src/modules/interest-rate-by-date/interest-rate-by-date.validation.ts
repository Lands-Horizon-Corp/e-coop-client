import z from 'zod'

import { PercentageSchema, entityIdSchema } from '@/validation'

export const InterestRateByDateSchema = z
    .object({
        id: entityIdSchema.optional(),

        from_date: z.coerce
            .string()
            .min(1, 'From date is required')
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid date format',
            })
            .transform((val) => new Date(val).toISOString()),
        to_date: z.coerce
            .string()
            .min(1, 'To date is required')
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid date format',
            })
            .transform((val) => new Date(val).toISOString()),
        interest_rate: PercentageSchema,
    })
    .superRefine((data, ctx) => {
        if (data.from_date && data.to_date) {
            const fromDate = new Date(data.from_date)
            const toDate = new Date(data.to_date)

            if (fromDate > toDate) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'From date must not be greater than to date',
                    path: ['from_date'],
                })
                ctx.addIssue({
                    code: 'custom',
                    message: 'To date must not be less than from date',
                    path: ['to_date'],
                })
            }
        }
    })

export type TInterestRateByDateSchema = z.infer<typeof InterestRateByDateSchema>
