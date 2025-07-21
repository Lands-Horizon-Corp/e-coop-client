import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validations/common'

export const TOrganizationMigrationStatus = z.enum([
    'pending',
    'migrating',
    'seeding',
    'completed',
    'canceled',
    'error',
])

export const OrganizationSchema = z.object({
    name: z.string().min(1, 'Organization name is required'),
    subscription_plan_id: entityIdSchema,
    address: z.string().optional(),
    email: z
        .string()
        .min(1, 'Email is Required')
        .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: 'Invalid email',
        }),
    contact_number: z.string().optional(),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    media_id: z.string().min(1, 'Organization Logo is required'),
    cover_media_id: z.string().min(1, 'Cover media is required'),
})

export type Organization = z.infer<typeof OrganizationSchema>
