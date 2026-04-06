import z from 'zod'

import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import { WithGeneratedReportSchema } from '../generated-report'
import {
    GENERAL_LEDGER_SOURCES,
    GL_BOOKS,
    TGLBook,
} from './general-ledger.constants'

export const generalLedgerSchema = z.object({
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    account_id: entityIdSchema.optional().nullable(),
    transaction_id: entityIdSchema.optional().nullable(),
    transaction_batch_id: entityIdSchema.optional().nullable(),
    employee_user_id: entityIdSchema.optional().nullable(),
    member_profile_id: entityIdSchema.optional().nullable(),
    member_joint_account_id: entityIdSchema.optional().nullable(),
    transaction_reference_number: z.string().optional(),
    reference_number: z.string().optional(),
    payment_type_id: entityIdSchema.optional().nullable(),
    source: z.string().optional(),
    journal_voucher_id: entityIdSchema.optional().nullable(),
    adjustment_entry_id: entityIdSchema.optional().nullable(),
    type_of_payment_type: z.string().optional(),
    credit: z.number().optional(),
    debit: z.number().optional(),
    balance: z.number().optional(),
})
export type TGeneralLedgerRequest = z.infer<typeof generalLedgerSchema>

export const ChangeORSchema = z.object({
    or_from: z.string().min(1, 'OR From is required'),
    or_to: z.string().min(1, 'OR To is required'),
})

export type TChangeORValues = z.infer<typeof ChangeORSchema>

export const GeneralLedgerSourceSchema = z.enum(GENERAL_LEDGER_SOURCES, {
    error: 'Invalid ledger source',
})

// REPORT GL BOOKS
export const GLBooksReport = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,
        book: z.enum(Object.keys(GL_BOOKS) as [TGLBook, ...TGLBook[]]),

        report_type: z.enum(['detailed', 'summary']).default('detailed'),
    })
    .and(WithGeneratedReportSchema)
    .superRefine((data, ctx) => {
        if (data.start_date && data.end_date) {
            if (data.start_date > data.end_date) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Start Date must not be past of End Date',
                    path: ['start_date'],
                })
                ctx.addIssue({
                    code: 'custom',
                    message: 'End Date must be later than Start Date',
                    path: ['end_date'],
                })
            }
        }
    })

export type TGLBooksReportSchema = z.infer<typeof GLBooksReport>

// REPORT TRIAL BALANCE
export const TrialBalanceReport = z
    .object({
        entry_date: stringDateWithTransformSchema,
        report_type: z.enum(['as_of', 'monthly']).default('as_of'),
    })
    .and(WithGeneratedReportSchema)

export type TTrialBalanceReportSchema = z.infer<typeof TrialBalanceReport>
