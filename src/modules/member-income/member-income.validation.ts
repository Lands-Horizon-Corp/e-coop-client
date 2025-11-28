import z from 'zod'

import {
    dateToISOTransformer,
    entityIdSchema,
    stringDateSchema,
} from '@/validation'

export const MemberIncomeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    source: z.string().min(1, 'Income source is required'),
    amount: z.coerce.number().min(1, 'Amount must be at least 1'),
    release_date: stringDateSchema.transform(dateToISOTransformer),
    media_id: entityIdSchema.optional(),
    media: z.any(),
})
