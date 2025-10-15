import z from 'zod'

import { entityIdSchema } from '@/validation'

export const CurrencySchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Currency name is required'),
    country: z.string().min(1, 'Country is required'),
    currency_code: z
        .string()
        .min(1, 'Currency code is required')
        .max(10, 'Currency code must be 10 characters or less')
        .regex(
            /^[A-Z]{3}$/,
            'Currency code must be 3 uppercase letters (e.g., USD, EUR)'
        ),
    symbol: z
        .string()
        .max(10, 'Symbol must be 10 characters or less')
        .optional(),
    emoji: z.string().max(10, 'Emoji must be 10 characters or less').optional(),
})

export type TCurrencySchema = z.infer<typeof CurrencySchema>
