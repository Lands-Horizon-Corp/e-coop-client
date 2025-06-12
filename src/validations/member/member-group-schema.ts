import { z } from 'zod'

export const createMemberGroupSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    description: z.string().max(500, 'Description is too long'),
    // organization_id: z.string().min(1, 'Organization ID is required'),
    // branch_id: z.string().min(1, 'Branch ID is required'),
})

export type TCreateMemberGroupSchema = z.infer<typeof createMemberGroupSchema>
