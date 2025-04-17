import z from 'zod'

export const companyIdPathSchema = z.object({
    companyId: z
        .string({
            required_error: 'Company ID is required',
            invalid_type_error: 'Invalid Company ID',
        })
        .uuid('Invalid Branch ID'),
})
