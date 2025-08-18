import { z } from 'zod'

import { entityIdSchema } from '../common'

export type IAdjustmentEntryTag = {
    id: string
    adjustment_entry_id: string
    name?: string
    description?: string
    category?: string
    color?: string
    icon?: string
}

export type IAdjustmentEntryTagRequest = {
    adjustment_entry_id: string
    name?: string
    description?: string
    category?: string
    color?: string
    icon?: string
}

export const AdjustmentEntryTagRequestSchema = z.object({
    adjustment_entry_id: entityIdSchema,
    name: z.string().max(50).optional(),
    description: z.string().optional(),
    category: z.string().max(50).optional(),
    color: z.string().max(20).optional(),
    icon: z.string().max(20).optional(),
})
