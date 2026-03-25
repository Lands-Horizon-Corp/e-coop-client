import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

import { OtherFundEntrySchema } from '../other-fund-entry'

export const OtherFundSchema = z.object({
    id: z.string().optional(),
    cash_voucher_number: z.coerce.string<string>().optional(),

    date: z.string().min(1, 'Date is required'),
    reference: z.coerce.string<string>().optional(),
    status: z
        .enum(['draft', 'printed', 'approved', 'released'])
        .default('draft')
        .optional(),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    name: z.string().min(1, 'Name is required'),

    currency_id: EntityIdSchema('Currency is required'),
    currency: z.any(),

    total_credit: z.number().min(0).optional(),
    total_debit: z.number().min(0).optional(),

    company_id: z.string().optional(),
    member_id: z.string().optional(),
    member_profile: z.any().optional(),
    other_fund_entries: z
        .array(OtherFundEntrySchema)
        .optional()
        .default([])
        .refine(
            (entries) => {
                const hasAllAccounts = entries.every(
                    (entry) =>
                        entry.account_id !== undefined &&
                        entry.account_id !== ''
                )
                return hasAllAccounts
            },
            {
                message:
                    'All journal voucher entries must have an Account selected.',
            }
        )
        .refine(
            (entries) => {
                if (entries.length === 0) return true
                const totalDebit = entries.reduce(
                    (acc, entry) => acc + (entry.debit || 0),
                    0
                )
                const totalCredit = entries.reduce(
                    (acc, entry) => acc + (entry.credit || 0),
                    0
                )
                return totalDebit === totalCredit
            },
            {
                message:
                    'Total debit and credit must be equal and greater than zero.',
            }
        ),
    other_fund_entries_deleted: z.array(entityIdSchema).optional().default([]),
})

export type TOtherFundSchema = z.infer<typeof OtherFundSchema>

export const OtherFundPrintSchema = z.object({
    cash_voucher_number: z.string().min(1, 'Voucher Number is required'),
    or_auto_generated: z.boolean().optional().default(false),
})

export type TOtherFundPrintSchema = z.infer<typeof OtherFundPrintSchema>
