import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    stringDateSchema,
} from '@/validation'

import { userAccountTypeSchema } from '../user'

export const InviationCodeSchema = z.object({
    code: z.string().min(1, 'invitation code is required'),
    expiration_date: stringDateSchema,
    current_use: z.coerce.number().min(0, 'Current use cannot be negative'),
    max_use: z.coerce.number().min(0, 'Current use cannot be negative'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    user_type: userAccountTypeSchema,

    permission_name: z.string(),
    permission_description: descriptionSchema.transform(
        descriptionTransformerSanitizer
    ),
    permissions: z.array(z.string()),
})

export type TInvitationCodeFormValues = z.infer<typeof InviationCodeSchema>
