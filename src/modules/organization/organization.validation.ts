import z from 'zod'

import {
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
    subscription_plan_id: z.string().min(1, 'Subscription plan is required'),
    address: z.string().optional(),
    email: emailSchema.min(1, 'Organization email is required'),
    contact_number: z.string().optional(),
    description: z.preprocess((val) => {
        if (val === '') return ''
        return val
    }, z.string().transform(descriptionTransformerSanitizer)),

    media_id: z.string().min(1, 'Organization Logo is required'),
    cover_media_id: z.string().min(1, 'Cover media is required'),
    currency_id: entityIdSchema.min(1, 'currency is required'),

    media: z.any().optional(),
    cover_media: z.any().optional(),
    subscription_plan: z.any().optional(),
    is_private: z.boolean().optional(),
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
}).omit({ currency_id: true })
export type TEditOrganizationFormValues = z.infer<typeof EditOrganizationSchema>
export type TOrganizationFormValues = z.infer<typeof OrganizationSchema>
