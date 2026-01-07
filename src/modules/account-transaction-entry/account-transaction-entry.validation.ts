import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const AccountTransactionEntrySchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'AccountTransactionEntry name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TAccountTransactionEntrySchema = z.infer<
    typeof AccountTransactionEntrySchema
>
