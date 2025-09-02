import z from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validation'

import { branchTypeEnum } from './branch.types'

export const branchSchema = z.object({
    type: z.enum(branchTypeEnum),
    name: z.string({ error: 'Name is Required' }).min(1),
    email: z.string({ error: 'Email is Required' }).email(),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    country_code: z.string({ error: 'Country code is required' }).min(2),
    contact_number: z
        .string({ error: 'Contact Number is at least 11 Characters' })
        .min(11),
    address: z.string({ error: 'Address is required' }).min(1),
    province: z.string({ error: 'Province is required' }).min(1),
    city: z.string({ error: 'City is required' }).min(1),
    barangay: z.string({ error: 'Barangay is required' }).min(1),
    region: z.string({ error: 'Region is required' }).min(1),
    postal_code: z.string({ error: 'Postal code is required' }).min(4),
    latitude: z.coerce.number<number>().optional(),
    longitude: z.coerce.number<number>().optional(),
    is_main_branch: z.boolean().catch(false),
    media_id: z.string('Branch Photo is Required').min(1),
    media: z.any(),
})

export type TBranchSchema = z.infer<typeof branchSchema>
