import { z } from 'zod'

import { USER_TYPE } from '@/constants'

export const userOrganizationSettingsSchema = z.object({
    user_type: z.enum(USER_TYPE),
    description: z.string(),
    user_setting_description: z
        .string()
        .min(1, 'Setting description is required'),
    user_setting_start_or: z.number().min(0, 'Start OR must be non-negative'),
    user_setting_end_or: z.number().min(0, 'End OR must be non-negative'),
    user_setting_used_or: z.number().min(0, 'Used OR must be non-negative'),
    user_setting_start_voucher: z
        .number()
        .min(0, 'Start voucher must be non-negative'),
    user_setting_end_voucher: z
        .number()
        .min(0, 'End voucher must be non-negative'),
    user_setting_used_voucher: z
        .number()
        .min(0, 'Used voucher must be non-negative'),
    user_setting_number_padding: z
        .number()
        .min(0, 'Number padding must be non-negative'),
    allow_withdraw_negative_balance: z.boolean(),
    allow_withdraw_exact_balance: z.boolean(),
    maintaining_balance: z.boolean(),
})

export type TUserOrganizationSettingsFormValues = z.infer<
    typeof userOrganizationSettingsSchema
>
