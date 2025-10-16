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
    iso_3166_alpha2: z
        .string()
        .length(2, 'ISO 3166-1 alpha-2 must be exactly 2 characters')
        .regex(
            /^[A-Z]{2}$/,
            'ISO 3166-1 alpha-2 must be uppercase letters (e.g., US, CA)'
        )
        .optional(),
    iso_3166_alpha3: z
        .string()
        .length(3, 'ISO 3166-1 alpha-3 must be exactly 3 characters')
        .regex(
            /^[A-Z]{3}$/,
            'ISO 3166-1 alpha-3 must be uppercase letters (e.g., USA, CAN)'
        )
        .optional(),
    iso_3166_numeric: z
        .string()
        .length(3, 'ISO 3166-1 numeric must be exactly 3 characters')
        .regex(
            /^\d{3}$/,
            'ISO 3166-1 numeric must be 3 digits (e.g., 840, 124)'
        )
        .optional(),
    phone_code: z
        .string()
        .max(10, 'Phone code must be 10 characters or less')
        .regex(
            /^\+\d+$/,
            'Phone code must start with + followed by digits (e.g., +1, +44)'
        )
        .optional(),
    domain: z
        .string()
        .max(10, 'Domain must be 10 characters or less')
        .regex(
            /^\.[a-z]{2,}$/,
            'Domain must start with . followed by lowercase letters (e.g., .com, .ca)'
        )
        .optional(),
    locale: z
        .string()
        .max(10, 'Locale must be 10 characters or less')
        .regex(
            /^[a-z]{2}-[A-Z]{2}$/,
            'Locale must be in format xx-XX (e.g., en-US, fr-CA)'
        )
        .optional(),
})

export type TCurrencySchema = z.infer<typeof CurrencySchema>
