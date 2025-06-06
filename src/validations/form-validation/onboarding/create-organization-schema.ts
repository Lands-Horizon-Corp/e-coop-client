import { z } from 'zod'

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
    subscription_plan_id: z.string().min(1, ' Subscription plan is required'),
    address: z.string().optional(),
    email: z
        .string()
        .min(1, 'Email is Required')
        .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: 'Invalid email',
        }),
    contact_number: z.string().optional(),
    description: z.string().optional(),
    media_id: z.string().min(1, 'Organization logo is required!'),
    cover_media_id: z.string().optional(),
})

export type Organization = z.infer<typeof OrganizationSchema>
