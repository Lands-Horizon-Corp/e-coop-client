import z from 'zod'

export const branchIdPathSchema = z.object({
    branchId: z.string({
        required_error: 'branch ID is required',
        invalid_type_error: 'Invalid branch ID',
    }),
})
