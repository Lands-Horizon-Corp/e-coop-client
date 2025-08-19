import { z } from 'zod'

import { entityIdSchema } from '@/validation'

// Define the Zod schema for MediaResponse
export const MediaResponseSchema = z.object({
    id: entityIdSchema,
    created_at: z.string(),
    updated_at: z.string(),
    file_name: z.string(),
    file_size: z.number(),
    file_type: z.string(),
    storage_key: z.string(),
    url: z.string(),
    key: z.string(),
    download_url: z.string(),
    bucket_name: z.string(),
    status: z.string(),
    progress: z.number(),
})

// Infer the TypeScript type from the Zod schema
export type TMedia = z.infer<typeof MediaResponseSchema>
