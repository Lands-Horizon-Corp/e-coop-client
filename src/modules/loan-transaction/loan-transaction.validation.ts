import z from 'zod'

import {
    EntityIdSchema,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'

import { ComakerCollateralSchema } from '../comaker-collateral'
import { ComakerMemberProfileSchema } from '../comaker-member-profile'
import { LoanClearanceAnalysisSchema } from '../loan-clearance-analysis'
import { LoanClearanceAnalysisInstitutionSchema } from '../loan-clearance-analysis-institution'
import { LoanTermsAndConditionAmountReceiptSchema } from '../loan-terms-and-condition-amount-receipt'
import { LoanTermsAndConditionSuggestedPaymentSchema } from '../loan-terms-and-condition-suggested-payment'
import { LoanTransactionEntrySchema } from '../loan-transaction-entry'
import {
    LOAN_COLLECTOR_PLACE,
    // LOAN_COMAKER_TYPE,
    LOAN_MODE_OF_PAYMENT,
    LOAN_TYPE,
    WEEKDAYS,
} from './loan.constants'

const WithWeekdays = z.discriminatedUnion(
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

const WithComaker = z.discriminatedUnion(
    'comaker_type',
    [
        z.object({
            comaker_type: z.literal('member'),
            comaker_member_profiles: z
                .array(ComakerMemberProfileSchema)
                .min(1, 'Comaker Member must have atleast 1 Member')
                .default([]),
            comaker_member_profiles_deleted: z
                .array(entityIdSchema)
                .default([]),
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
            comaker_collaterals: z
                .array(ComakerCollateralSchema)
                .min(1, 'Comaker collateral must at least have 1 collateral')
                .default([]),
            comaker_collaterals_deleted: z.array(entityIdSchema).default([]),
        }),
        z.object({
            comaker_type: z.literal('none'),
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

        // comaker_type: z
        //     .enum(LOAN_COMAKER_TYPE, {
        //         error: 'Please select valid comaker',
        //     })
        //     .default('none'),

        collector_place: z.enum(LOAN_COLLECTOR_PLACE, {
            error: 'Please select valid collector place',
        }),

        loan_type: z.enum(LOAN_TYPE),
        terms: z.coerce
            .number('Invalid Terms')
            .min(1, 'Minimum 1 term (Month)')
            .int('Invalid Terms'),

        previous_loan_id: entityIdSchema.optional(),
        previous_loan: z.any(),

        amortization_amount: z.coerce.number().optional(),
        is_add_on: z.boolean().optional(),

        applied_1: z.coerce
            .number('Invalid amount')
            .min(1, 'Loan amount must not be 0'), // AMOUNT
        applied_2: z.coerce.number('Invalid amount').optional(),

        account_id: EntityIdSchema('Loan Account is required'),
        account: z.any(),

        loan_transaction_entries: z.array(LoanTransactionEntrySchema),
        loan_transaction_entries_deleted: z.array(entityIdSchema).optional(), // not saved in backend, just for indicator what to delete

        member_profile_id: EntityIdSchema('Member'),
        member_profile: z.any(), // just for member prorifle picker (client side)

        member_joint_account_id: entityIdSchema.optional(),
        signature_media_id: entityIdSchema.optional(),

        mount_to_be_closed: z.coerce.number().optional(),
        damayan_fund: z.coerce.number().optional(),
        share_capital: z.coerce.number().optional(),
        length_of_service: z.string().optional(),

        exclude_sunday: z.boolean().optional(),
        exclude_holiday: z.boolean().optional(),
        exclude_saturday: z.boolean().optional(),

        //Loan Clearance Analysis
        loan_clearance_analysis: z
            .array(LoanClearanceAnalysisSchema)
            .optional()
            .default([]),
        loan_clearance_analysis_deleted: z
            .array(entityIdSchema)
            .optional()
            .default([]),

        loan_clearance_analysis_institution: z
            .array(LoanClearanceAnalysisInstitutionSchema)
            .optional()
            .default([]),
        loan_clearance_analysis_institution_deleted: z
            .array(entityIdSchema)
            .optional()
            .default([]),

        // Terms and Condition / Receipt
        loan_terms_and_condition_amount_receipt: z
            .array(LoanTermsAndConditionAmountReceiptSchema)
            .optional()
            .default([]),
        loan_terms_and_condition_amount_receipt_deleted: z
            .array(entityIdSchema)
            .optional()
            .default([]),

        loan_terms_and_condition_suggested_payment: z
            .array(LoanTermsAndConditionSuggestedPaymentSchema)
            .optional()
            .default([]),
        loan_terms_and_condition_suggested_payment_deleted: z
            .array(entityIdSchema)
            .optional()
            .default([]),

        remarks_other_terms: z.string().optional(),
        remarks_payroll_deduction: z.boolean().optional(),
        record_of_loan_payments_or_loan_status: z.string().optional(),
        collateral_offered: z.string().optional(),

        appraised_value: z.coerce.number().optional(),
        appraised_value_description: z.string().optional(),

        printed_date: stringDateWithTransformSchema.optional(), // if u change this and save, no effect in server
        approved_date: stringDateWithTransformSchema.optional(), // if u change this and save, no effect in server
        released_date: stringDateWithTransformSchema.optional(), // if u change this and save, no effect in server

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

// FOR LOAN SIGNATURE
// for signature
export const LoanTransactionSignatureSchema = z.object({
    prepared_by_signature_media_id: entityIdSchema.optional(),
    prepared_by_signature_media: z.any(),
    prepared_by_name: z.coerce.string().optional(),
    prepared_by_position: z.coerce.string().optional(),

    certified_by_signature_media_id: entityIdSchema.optional(),
    certified_by_signature_media: z.any(),
    certified_by_name: z.coerce.string().optional(),
    certified_by_position: z.coerce.string().optional(),

    approved_by_signature_media_id: entityIdSchema.optional(),
    approved_by_signature_media: z.any(),
    approved_by_name: z.coerce.string().optional(),
    approved_by_position: z.coerce.string().optional(),

    verified_by_signature_media_id: entityIdSchema.optional(),
    verified_by_signature_media: z.any(),
    verified_by_name: z.coerce.string().optional(),
    verified_by_position: z.coerce.string().optional(),

    check_by_signature_media_id: entityIdSchema.optional(),
    check_by_signature_media: z.any(),
    check_by_name: z.coerce.string().optional(),
    check_by_position: z.coerce.string().optional(),

    acknowledge_by_signature_media_id: entityIdSchema.optional(),
    acknowledge_by_signature_media: z.any(),
    acknowledge_by_name: z.coerce.string().optional(),
    acknowledge_by_position: z.coerce.string().optional(),

    noted_by_signature_media_id: entityIdSchema.optional(),
    noted_by_signature_media: z.any(),
    noted_by_name: z.coerce.string().optional(),
    noted_by_position: z.coerce.string().optional(),

    posted_by_signature_media_id: entityIdSchema.optional(),
    posted_by_signature_media: z.any(),
    posted_by_name: z.coerce.string().optional(),
    posted_by_position: z.coerce.string().optional(),

    paid_by_signature_media_id: entityIdSchema.optional(),
    paid_by_signature_media: z.any(),
    paid_by_name: z.coerce.string().optional(),
    paid_by_position: z.coerce.string().optional(),
})

export type TLoanTransactionSignatureSchema = z.infer<
    typeof LoanTransactionSignatureSchema
>
