import z from 'zod'

export const branchRequestSchema = z.object({
    media_id: z.string().nullable(),
    media: z.any(),
    type: z.union([z.literal('cooperative branch'), z.string()]),
    name: z.string().min(1, 'Name is Required'),
    email: z.string().email('Invalid Email').min(1, 'Email is Required'),
    description: z
        .string()
        .min(15, 'Description is Required, Min of 15 Characters'),
    country_code: z.string().min(2, 'Country code is required'),
    contact_number: z
        .string()
        .min(11, 'Contact Number is at least 11 Characters'),
    address: z.string().min(1, 'Address is required'),
    province: z.string().min(1, 'Province is required'),
    city: z.string().min(1, 'City is required'),
    region: z.string().min(1, 'Region is required'),
    barangay: z.string().min(1, 'Barangay is required'),
    postal_code: z.string().min(4, 'Postal code is required'),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    is_main_branch: z.boolean().optional().default(false),
})
