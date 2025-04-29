import z from 'zod'

export const branchIdPathSchema = z.object({
    branchId: z.coerce
        .string({
            required_error: 'Branch ID is required',
            invalid_type_error: 'Invalid Branch ID',
        })
        .uuid('Invalid Branch ID'),
})
