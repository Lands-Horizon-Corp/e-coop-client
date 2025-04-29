import z from 'zod'

export const ownerIdPathSchema = z.object({
    branchId: z.string({
        required_error: 'owner ID is required',
        invalid_type_error: 'Invalid Owner ID',
    }),
})
