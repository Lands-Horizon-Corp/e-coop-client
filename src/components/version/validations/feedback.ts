import { FEEDBACK_TYPE } from '@/constants'
import z from 'zod'

import { FEEDBACK_TYPE } from '@/constants'
import { entityIdSchema } from '@/validations/common'

const FeedbackFormSchema = z.object({
    media_id: entityIdSchema.optional(),

    feedback_type: z.enum(FEEDBACK_TYPE, {
        required_error: 'feedback type is required',
    }),
    description: z
        .string({ required_error: 'feedback message is required' })
        .min(20, 'feedback message must be at least 20 characters long'),
    email: z
        .string({ required_error: 'Email is required' })
        .email('Email must be valid'),

    name: z.string({ required_error: 'Name is required' }),
})

export default FeedbackFormSchema
