import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

const notificationTypeSchema = z.enum([
    'success',
    'warning',
    'info',
    'error',
    'general',
    'report',
])

export const NotificationSchema = z.object({
    user_id: entityIdSchema,
    title: z.string().min(1, 'Title is required'),
    description: descriptionSchema
        .min(10, 'Min 10 character description')
        .transform(descriptionTransformerSanitizer),
    is_viewed: z.boolean().default(false),
    notification_type: notificationTypeSchema.default('general'),
})

export type TNotificationSchema = z.infer<typeof NotificationSchema>
