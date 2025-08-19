import { z } from 'zod'

import { createAPIHookRepository } from '@/providers/repositories/api-crud-factory'

import { entityIdSchema } from '../types/common'
import { MediaResponseSchema } from './media'

// import { UserResponseSchema } from './user'
// import { OrganizationResponseSchema } from './organization'
// import { BranchResponseSchema } from './branch'

// Define the Zod schema for BankResponse
export const BankResponseSchema = z.object({
    id: entityIdSchema,
    created_at: z.string(),
    created_by_id: entityIdSchema,
    // created_by: UserResponseSchema.optional(),
    updated_at: z.string(),
    updated_by_id: entityIdSchema,
    // updated_by: UserResponseSchema.optional(),
    organization_id: entityIdSchema,
    // organization: OrganizationResponseSchema.optional(),
    branch_id: entityIdSchema,
    // branch: BranchResponseSchema.optional(),
    media_id: entityIdSchema.optional(),
    media: MediaResponseSchema.optional(),
    name: z.string(),
    description: z.string(),
})

// Define the Zod schema for BankRequest
export const BankRequestSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    media_id: entityIdSchema.optional(),
})

// Infer the TypeScript types from the Zod schemas
export type IBank = z.infer<typeof BankResponseSchema>
export type IBankRequest = z.infer<typeof BankRequestSchema>

const BankDataLayer = createAPIHookRepository({
    url: '/api/v1/bank',
    baseKey: 'bank',
})

// add custom mo dito na hook

export default { ...BankDataLayer }
