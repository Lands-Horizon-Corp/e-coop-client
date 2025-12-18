import z from 'zod'

import {
    EntityIdSchema,
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
    id: entityIdSchema.optional(),

    name: z.string().min(1, 'Organization name is required'),
    address: z.string().optional(),
    email: emailSchema.min(1, 'Organization email is required').optional(),
    contact_number: z.string().optional(),
    description: z.preprocess((val) => {
        if (val === '') return ''
        return val
    }, z.string().transform(descriptionTransformerSanitizer)),

    currency_id: entityIdSchema.min(1, 'currency is required'),

    media_id: EntityIdSchema('Logo').optional(),
    media: z.any().optional(),

    cover_media_id: EntityIdSchema('Cover media is required').optional(),
    cover_media: z.any().optional(),

    subscription_plan_id: z.string().min(1, 'Subscription plan is required'),
    subscription_plan: z.any().optional(),

    is_private: z.boolean().optional(),

    terms_and_conditions: z.string().optional(),
    privacy_policy: z.string().optional(),
    cookie_policy: z.string().optional(),
    refund_policy: z.string().optional(),
    user_agreement: z.string().optional(),

    // SOCIALS
    facebook_link: z.url().optional(),
    x_link: z.url().optional(),
    youtube_link: z.url().optional(),
    personal_website_link: z.url().optional(),
    instagram_link: z.url().optional(),

    theme: z.string().optional(),
})
// }).omit({ currency_id: true })

export type TOrganizationSchema = z.infer<typeof OrganizationSchema>

// WONDER WHY THERES 2 ORG schema? CUZ EDIT IS DIFFERENT FROM CREATE
export const OrganizationEditSchema = OrganizationSchema.omit({
    currency_id: true,
})
export type TOrganizationEditSchema = z.infer<typeof OrganizationSchema>
