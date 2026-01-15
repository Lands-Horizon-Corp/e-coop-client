import z from 'zod'

import { PercentageSchema, entityIdSchema } from '@/validation'

export const InterestRateByYearSchema = z
    .object({
        id: entityIdSchema.optional(),

        from_year: z.coerce
            .number()
            .int('From year must be a whole number')
            .min(0, 'From year must be at least 0')
            .refine((val) => !isNaN(val), {
                message: 'From year is required',
            }),
        to_year: z.coerce
            .number()
            .int('To year must be a whole number')
            .min(0, 'To year must be at least 0')
            .refine((val) => !isNaN(val), {
                message: 'To year is required',
            }),
        interest_rate: PercentageSchema,
    })
    .superRefine((data, ctx) => {
        if (data.from_year !== undefined && data.to_year !== undefined) {
            if (data.from_year > data.to_year) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'From year must not be greater than to year',
                    path: ['from_year'],
                })
                ctx.addIssue({
                    code: 'custom',
                    message: 'To year must not be less than from year',
                    path: ['to_year'],
                })
            }
        }
    })

export type TInterestRateByYearSchema = z.infer<typeof InterestRateByYearSchema>
