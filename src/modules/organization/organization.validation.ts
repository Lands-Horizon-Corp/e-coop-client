import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    emailSchema,
    entityIdSchema,
} from '@/validation'

export const OrganizationMigrationStatus = z.enum([
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
    email: emailSchema.min(1, 'Organization email is required'),
    contact_number: z.string().optional(),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),

    media_id: z.string().min(1, 'Organization Logo is required'),
    cover_media_id: z.string().min(1, 'Cover media is required'),

    media: z.any().optional(),
    cover_media: z.any().optional(),
    subscription_plan: z.any().optional(),
})

export const EditOrganizationSchema = OrganizationSchema.extend({
    id: entityIdSchema.optional(),
    is_private: z.boolean().optional(),
    terms_and_conditions: z.string().optional(),
    privacy_policy: z.string().optional(),
    cookie_policy: z.string().optional(),
    refund_policy: z.string().optional(),
    user_agreement: z.string().optional(),
    media_id: z.string().optional(),
    cover_media_id: z.string().optional(),
})

export type TOrganizationFormValues = z.infer<typeof OrganizationSchema>
