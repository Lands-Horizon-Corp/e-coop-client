import z from 'zod'

import { descriptionSchema } from '@/validation'

export const holidaySchema = z.object({
    name: z.string().min(1, 'Holiday name is required'),
    entry_date: z.string().min(1, 'Date is required'),
    description: descriptionSchema,
})

export type THolidayFormValues = z.infer<typeof holidaySchema>
