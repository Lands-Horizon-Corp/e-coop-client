import z from 'zod'

<<<<<<< HEAD
import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'
=======
import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'
>>>>>>> 264d7b283 (feat: added module company)

export const CompanySchema = z.object({
    name: z.string().min(1, 'Company name is required'),
<<<<<<< HEAD
    description: z
        .string()
=======
    media_id: entityIdSchema.optional(),
    media: z.any(),
    description: descriptionSchema
>>>>>>> 264d7b283 (feat: added module company)
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})
