import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const DisbursementSchema = z.object({
    id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),

    name: z.coerce.string().min(1, 'Name is required'),
    icon: z.coerce.string().optional(),
    description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TDisbursementFormValues = z.infer<typeof DisbursementSchema>
