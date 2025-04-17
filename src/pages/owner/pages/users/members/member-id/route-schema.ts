import z from 'zod'

export const memberIdPathSchema = z.object({
    memberId: z.coerce
        .string({
            required_error: 'Member ID is required',
            invalid_type_error: 'Invalid Member ID',
        })
        .uuid('Invalid Member ID'),
})
