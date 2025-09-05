import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { EDUCATIONAL_ATTAINMENT } from './constants'

export const educationalAttainmentSchema = z.enum(EDUCATIONAL_ATTAINMENT)

export const MemberEducationalAttainmentSchema = z.object({
    id: z.string().optional(),
    branch_id: entityIdSchema.optional(),
    member_profile_id: entityIdSchema,
    school_name: z.string().min(1, 'School name is required').optional(),
    school_year: z.coerce
        .number({ error: 'Invalid Year' })
        .transform((val) => Math.trunc(val))
        .refine(
            (val) => {
                const year = Number(val)
                const currentYear = new Date().getFullYear()
                return year >= 1900 && year <= currentYear + 1
            },
            { message: 'Enter a valid school year' }
        )
        .optional(),
    program_course: z.string().min(1, 'Program/Course is required').optional(),
    educational_attainment: z.enum(EDUCATIONAL_ATTAINMENT, {
        error: 'Educational attainment is required',
    }),
    description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
})
