import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

import { TIME_MACHINE_REASON_OPTIONS } from './time-machine-log.utils'

export const TimeMachineLogSchema = z.object({
    timezone: z
        .string()
        .min(1, 'time zone is required')
        .max(255, 'timezone max length is 255 characters only!'),
    frozen_at: z.string().min(1, 'frozen at is required!'),
    frozen_until_seconds: z.coerce.number().min(0),
    description: z
        .string()
        .max(1000, 'max length is 1000 charaters only!')
        .optional()
        .transform(descriptionTransformerSanitizer),
    reason: z
        .enum(TIME_MACHINE_REASON_OPTIONS, {
            message: 'Please select a valid reason.',
        })
        .optional(),
})

export const TimeMachineCancelSchema = TimeMachineLogSchema.pick({
    reason: true,
    description: true,
})

export type TTimeMachineLogSchema = z.infer<typeof TimeMachineLogSchema>
