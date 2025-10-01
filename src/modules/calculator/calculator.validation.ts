import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

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
const WithModeOfPayment = z.discriminatedUnion(
    'mode_of_payment',
    [
        z.object({
            mode_of_payment: z.literal('day'),
            mode_of_payment_fixed_days: z.coerce
                .number('Invalid number of days')
                .min(1, 'Minimum of 1 day'),
        }),
        z.object({
            mode_of_payment: z.literal('weekly'),
            mode_of_payment_weekly: z.enum(WEEKDAYS, {
                error: 'Please provide valid weekdays',
            }),
        }),
        z
            .object({
                mode_of_payment: z.literal('semi-monthly'),
                mode_of_payment_semi_monthly_pay_1: z.coerce
                    .number('Choose a valid day 1 - 30')
                    .int()
                    .min(1, 'Must not less than 1')
                    .max(31, 'Must not exceed 31'),
                mode_of_payment_semi_monthly_pay_2: z.coerce
                    .number('Choose a valid day 1 - 30')
                    .int()
                    .min(1, 'Must not less than 1')
                    .max(31, 'Must not exceed 31'),
            })
            .refine(
                (data) =>
                    data.mode_of_payment_semi_monthly_pay_1 <
                    data.mode_of_payment_semi_monthly_pay_2,
                {
                    error: 'First payment date must be less than second payment date',
                    path: ['mode_of_payment_semi_monthly_pay_1'],
                }
            ),
        z.object({
            mode_of_payment: z.literal('monthly'),
            mode_of_payment_monthly_exact_day: z.boolean().default(false),
        }),
        z.object({
            mode_of_payment: z
                .enum(
                    LOAN_MODE_OF_PAYMENT.filter(
                        (val) =>
                            ![
                                'weekly',
                                'day',
                                'semi-monthly',
                                'monthly',
                            ].includes(val)
                    )
                )
                .default('monthly'),
        }),
    ],
    {
        error: 'Invalid mode of payment',
    }
)

export const MockLoanInputSchema = z
    .object({
        account_id: EntityIdSchema('Account ID is required'),
        account: z.any().optional(),

        applied_1: z.coerce.number().min(0).default(0),
        terms: z.coerce.number().min(0).default(0),
        is_add_on: z.boolean().default(false),

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

        exclude_sunday: z.boolean().optional(),
        exclude_holiday: z.boolean().optional(),
        exclude_saturday: z.boolean().optional(),
    })
    .and(WithModeOfPayment)

export type TMockCloanInputSchema = z.infer<typeof MockLoanInputSchema>
