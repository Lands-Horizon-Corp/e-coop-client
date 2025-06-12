import z from 'zod'

import { otpCodeSchema } from '@/validations/common'

export const otpSchema = z.object({
    otp: otpCodeSchema,
})
