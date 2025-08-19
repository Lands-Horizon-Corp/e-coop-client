import { z } from 'zod'

import {
    auditableSchema,
    entityIdSchema,
    timeStampsSchema,
} from '@/types/common'

import { UserBaseSchema } from '../user/user.validation'

// Validation schema for IMedia
export const MediaSchema = z
    .object({
        id: entityIdSchema,
        file_name: z.string().min(1).max(255),
        file_size: z.number().positive(),
        file_type: z.string().min(1).max(50),
        storage_key: z.string().min(1).max(255),
        url: z.string().url(),
        bucket_name: z.string().min(1).max(255),
        download_url: z.string().url(),
        description: z.string().optional(),
    })
    .extend(timeStampsSchema)
    .extend(auditableSchema)

// Validation schema for IMediaRequest
export const MediaRequestSchema = z.object({
    id: entityIdSchema.optional(),
    file_name: z.string().min(1).max(255),
    file_size: z.number().positive(),
    fileType: z.string().min(1).max(50),
    storageKey: z.string().min(1).max(255),
    key: z.string().optional(),
    url: z.string().url().optional(),
    bucketName: z.string().min(1).max(255).optional(),
    userId: entityIdSchema.optional(),
    user: UserBaseSchema.optional(),
})
