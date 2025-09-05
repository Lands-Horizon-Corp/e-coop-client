import z from 'zod'

import { descriptionSchema, entityIdSchema } from '@/validation'

const modeOfPaymentSchema = z.string().optional()

export const chargesRateMemberTypeModeOfPaymentsSchema = z.object({
    member_type_id: entityIdSchema.min(1, 'Member Type ID is required'),
    mode_of_payment: modeOfPaymentSchema,
    name: z.string().optional(),
    description: descriptionSchema.optional(),
})
export type TChargesRateMemberTypeModeOfPaymenFormValues = z.infer<
    typeof chargesRateMemberTypeModeOfPaymentsSchema
>
