import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

import { WithModeOfPaymentSchema } from '../loan-transaction'
import {
    LOAN_MODE_OF_PAYMENT,
    WEEKDAYS,
} from '../loan-transaction/loan.constants'

export const CalculatorSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Calculator name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),
})

export type TCalculatorSchema = z.infer<typeof CalculatorSchema>

// FOR MOCK LOAN INPUTS
export const MockLoanInputSchema = z
    .object({
        account_id: EntityIdSchema('Account ID is required'),
        account: z.any().optional(),

        applied_1: z.coerce.number().min(1).default(0),
        terms: z.coerce.number().min(1).default(1),
        is_add_on: z.boolean().default(false),

        member_type: z.any().optional(),
        member_type_id: entityIdSchema.optional(),

        mode_of_payment: z.enum(LOAN_MODE_OF_PAYMENT).default('monthly'),
        mode_of_payment_fixed_days: z.coerce
            .number('Invalid number of days')
            .optional(),

        mode_of_payment_weekly: z
            .enum(WEEKDAYS, {
                error: 'Please provide valid weekdays',
            })
            .optional()
            .default('monday'),

        mode_of_payment_semi_monthly_pay_1: z.coerce
            .number('Choose a valid day 1 - 30')
            .int()
            .optional(),
        mode_of_payment_semi_monthly_pay_2: z.coerce
            .number('Choose a valid day 1 - 30')
            .int()
            .optional(),

        mode_of_payment_monthly_exact_day: z
            .boolean()
            .optional()
            .default(false),

        accounts: z.array(z.any()).optional().default([]), // ONLY IN CALC

        exclude_sunday: z.boolean().default(false),
        exclude_holiday: z.boolean().default(false),
        exclude_saturday: z.boolean().default(false),

        cash_on_hand_account: z.any().optional(),
        cash_on_hand_account_id: entityIdSchema.optional(),

        computation_sheet: z.any().optional(),
        computation_sheet_id: entityIdSchema.optional(),
    })
    .and(WithModeOfPaymentSchema)

export type TMockCloanInputSchema = z.infer<typeof MockLoanInputSchema>
