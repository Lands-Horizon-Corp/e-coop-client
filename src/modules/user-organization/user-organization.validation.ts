import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { USER_TYPE } from '../user/user.constants'

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
    user_type: z.enum(USER_TYPE).optional(),
    description: z.string().optional(),

    application_description: z.string().optional(),
    application_status: z
        .enum(['pending', 'reported', 'accepted', 'ban'])
        .optional(),

    user_setting_description: z.coerce.string().optional(),

    payment_or_unique: z.boolean().optional(),
    payment_or_allow_user_input: z.boolean().optional(),

    payment_or_current: z.coerce
        .number()
        .min(1, 'Current OR must be at least 1')
        .optional(),

    payment_or_start: z.coerce
        .number()
        .min(1, 'Start OR must be at least 1')
        .optional(),

    payment_or_end: z.coerce
        .number()
        .min(1, 'End OR must be at least 1')
        .optional(),

    payment_or_iteration: z.coerce
        .number()
        .min(1, 'Iteration must be at least 1')
        .optional(),

    payment_or_use_date_or: z.boolean().optional(),
    payment_prefix: z.string().optional(),

    payment_padding: z.coerce
        .number()
        .min(0, 'Number padding must be non-negative')
        .optional(),

    allow_withdraw_negative_balance: z.boolean().optional(),
    allow_withdraw_exact_balance: z.boolean().optional(),
    maintaining_balance: z.boolean().optional(),

    time_machine_time: z.coerce
        .string()
        .optional()
        .transform((val) => {
            if (!val || val === '') return undefined

            const date = new Date(val)
            if (isNaN(date.getTime())) return undefined

            return date.toISOString()
        }),

    settings_accounting_payment_default_value_id: entityIdSchema
        .optional()
        .nullable(),

    settings_accounting_deposit_default_value_id: entityIdSchema
        .optional()
        .nullable(),

    settings_accounting_withdraw_default_value_id: entityIdSchema
        .optional()
        .nullable(),

    settings_payment_type_default_value_id: entityIdSchema
        .optional()
        .nullable(),

    settings_accounting_payment_default_value: z.any(),
    settings_accounting_deposit_default_value: z.any(),
    settings_accounting_withdraw_default_value: z.any(),
})

export type TUserOrganizationSettingsSchema = z.infer<
    typeof UserOrganizationSettingsSchema
>
