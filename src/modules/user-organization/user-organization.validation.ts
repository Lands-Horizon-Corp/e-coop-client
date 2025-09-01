import z from 'zod'

import { USER_TYPE } from '@/constants'
import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const UserOrgPermissionSchema = z.object({
    permission_name: z.string().min(1, 'Permission name is required'),
    permission_description: z
        .string()
        .min(5, 'Please write enough description')
        .optional()
        .transform(descriptionTransformerSanitizer),
    permissions: z
        .array(z.string())
        .min(1, 'At least one permission is required'),
})

export type TUserOrgPermissionSchema = z.infer<typeof UserOrgPermissionSchema>

export const UserOrganizationSettingsSchema = z.object({
    user_type: z.enum(USER_TYPE),
    description: z.string(),
    user_setting_description: z
        .string()
        .min(1, 'Setting description is required'),
    user_setting_start_or: z.coerce.number().min(0, 'Start OR must be non-negative'),
    user_setting_end_or: z.coerce.number().min(0, 'End OR must be non-negative'),
    user_setting_used_or: z.coerce.number().min(0, 'Used OR must be non-negative'),
    user_setting_start_voucher: z
        .coerce.number()
        .min(0, 'Start voucher must be non-negative'),
    user_setting_end_voucher: z
        .coerce.number()
        .min(0, 'End voucher must be non-negative'),
    user_setting_used_voucher: z
        .coerce.number()
        .min(0, 'Used voucher must be non-negative'),
    user_setting_number_padding: z
        .coerce.number()
        .min(0, 'Number padding must be non-negative'),
    allow_withdraw_negative_balance: z.boolean(),
    allow_withdraw_exact_balance: z.boolean(),
    maintaining_balance: z.boolean(),

    settings_payment_type_default_value_id: entityIdSchema
        .optional()
        .nullable(),

    settings_accounting_payment_default_value_id: entityIdSchema
        .optional()
        .nullable(),
    settings_accounting_payment_default_value: z.any().optional().nullable(),

    settings_accounting_deposit_default_value_id: entityIdSchema
        .optional()
        .nullable(),
    settings_accounting_deposit_default_value: z.any().optional(),

    settings_accounting_withdraw_default_value_id: entityIdSchema
        .optional()
        .nullable(),
    settings_accounting_withdraw_default_value: z.any().optional(),
})

export type TUserOrganizationSettingsSchema = z.infer<
    typeof UserOrganizationSettingsSchema
>
