import z from 'zod'

const FeedbackFormSchema = z.object({
    feedbackType: z
        .string({ required_error: 'feedback type is required' })
        .min(1, 'feedback is required'),
    description: z
        .string({ required_error: 'feedback message is required' })
        .min(20, 'feedback message must be at least 20 characters long'),
    email: z
        .string({ required_error: 'Email is required' })
        .email('Email must be valid'),
})

export default FeedbackFormSchema
