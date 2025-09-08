import z from 'zod'

import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import {
    LOAN_COLLECTOR_PLACE,
    LOAN_COMAKER_TYPE,
    LOAN_MODE_OF_PAYMENT,
    LOAN_TYPE,
    WEEKDAYS,
} from './loan.constants'

const WithWeekdays = z.discriminatedUnion(
    'mode_of_payment',
    [
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
            mode_of_payment: z.enum(
                LOAN_MODE_OF_PAYMENT.filter(
                    (val) => !['weekly', 'semi-monthly'].includes(val)
                )
            ),
        }),
    ],
    {
        error: 'Invalid mode of payment',
    }
)

const WithComaker = z.discriminatedUnion(
    'comaker_type',
    [
        z.object({
            comaker_type: z.literal('member'),
            comaker_member_profile_id: z.uuidv4('Comaker member is required'),
            comaker_member_profile: z.any(),
        }),
        z.object({
            comaker_type: z.literal('deposit'),
            comaker_deposit_member_accounting_ledger_id: z.uuidv4(
                'Invalid member accounting ledger'
            ),
            comaker_deposit_member_accounting_ledger: z.any(),
        }),
        z.object({
            comaker_type: z.literal('others'),
            comaker_collateral_id: entityIdSchema,
            comaker_collateral_description: z.string().optional(),
        }),
    ],
    { error: 'Invalid comaker' }
)

export const LoanTransactionSchema = z
    .object({
        id: entityIdSchema.optional(),

        official_receipt_number: z.string().optional(),
        voucher: z.string().optional(),
        loan_purpose_id: entityIdSchema.optional(),
        loan_status_id: entityIdSchema.optional(),

        comaker_type: z.enum(LOAN_COMAKER_TYPE, {
            error: 'Please select valid comaker',
        }),

        collector_place: z.enum(LOAN_COLLECTOR_PLACE, {
            error: 'Please select valid collector place',
        }),

        loan_type: z.enum(LOAN_TYPE),
        terms: z.coerce.number('Invalid Terms').int('Invalid Terms'),

        previous_loan_id: entityIdSchema.optional(),
        previous_loan: z.any(),

        amortization_amount: z.number().optional(),
        is_add_on: z.boolean().optional(),

        applied_1: z.coerce.number('Invalid amount'),
        applied_2: z.coerce.number('Invalid amount').optional(),

        account_id: entityIdSchema.optional(),
        account: z.any(),

        member_profile_id: entityIdSchema.optional(),
        member_profile: z.any().optional(), // just for member prorifle picker

        member_joint_account_id: entityIdSchema.optional(),
        signature_media_id: entityIdSchema.optional(),

        mount_to_be_closed: z.number().optional(),
        damayan_fund: z.number().optional(),
        share_capital: z.number().optional(),
        length_of_service: z.string().optional(),

        exclude_sunday: z.boolean().optional(),
        exclude_holiday: z.boolean().optional(),
        exclude_saturday: z.boolean().optional(),

        remarks_other_terms: z.string().optional(),
        remarks_payroll_deduction: z.boolean().optional(),
        record_of_loan_payments_or_loan_status: z.string().optional(),
        collateral_offered: z.string().optional(),

        appraised_value: z.number().optional(),
        appraised_value_description: z.string().optional(),

        printed_date: stringDateWithTransformSchema.optional(),
        approved_date: stringDateWithTransformSchema.optional(),
        released_date: stringDateWithTransformSchema.optional(),

        approved_by_signature_media_id: entityIdSchema.optional(),
        approved_by_name: z.string().optional(),
        approved_by_position: z.string().optional(),

        prepared_by_signature_media_id: entityIdSchema.optional(),
        prepared_by_name: z.string().optional(),
        prepared_by_position: z.string().optional(),

        certified_by_signature_media_id: entityIdSchema.optional(),
        certified_by_name: z.string().optional(),
        certified_by_position: z.string().optional(),

        verified_by_signature_media_id: entityIdSchema.optional(),
        verified_by_name: z.string().optional(),
        verified_by_position: z.string().optional(),

        check_by_signature_media_id: entityIdSchema.optional(),
        check_by_name: z.string().optional(),
        check_by_position: z.string().optional(),

        acknowledge_by_signature_media_id: entityIdSchema.optional(),
        acknowledge_by_name: z.string().optional(),
        acknowledge_by_position: z.string().optional(),

        noted_by_signature_media_id: entityIdSchema.optional(),
        noted_by_name: z.string().optional(),
        noted_by_position: z.string().optional(),

        posted_by_signature_media_id: entityIdSchema.optional(),
        posted_by_name: z.string().optional(),
        posted_by_position: z.string().optional(),

        paid_by_signature_media_id: entityIdSchema.optional(),
        paid_by_name: z.string().optional(),
        paid_by_position: z.string().optional(),
    })
    .and(WithWeekdays)
    .and(WithComaker)

export type TLoanTransactionSchema = z.infer<typeof LoanTransactionSchema>
