import z from 'zod'

import { entityIdSchema, descriptionTransformerSanitizer } from '@/validation'

export const CashCheckVoucherEntrySchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'CashCheckVoucherEntry name is required'),
    description: z.string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TCashCheckVoucherEntrySchema = z.infer<typeof CashCheckVoucherEntrySchema>
