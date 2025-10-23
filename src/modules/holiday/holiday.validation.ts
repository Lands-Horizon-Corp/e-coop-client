import z from 'zod'

import { EntityIdSchema } from '@/validation'

export const HolidaySchema = z.object({
    name: z.string().min(1, 'Holiday name is required'),
    entry_date: z.string().min(1, 'Date is required'),

    currency_id: EntityIdSchema('Currency is required'),
    currency: z.any().optional(),

    description: z
        .string()
        .min(5, 'Please provide a descriptive description')
        .optional(),
})

export type THolidaySchema = z.infer<typeof HolidaySchema>
