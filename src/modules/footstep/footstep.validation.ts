import z from 'zod'

import { entityIdSchema } from '@/validation'

export const footstepRequestSchema = z.object({
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    user_id: entityIdSchema.optional().nullable(),
    media_id: entityIdSchema.optional().nullable(),
    description: z.string().min(1),
    activity: z.string().min(1),
    account_type: z.string().min(1).max(11),
    module: z.string().min(1),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    ip_address: z.string().max(45),
    user_agent: z.string().max(1000),
    referer: z.string().max(1000),
    location: z.string().max(255),
    accept_language: z.string().max(255),
})
