import z from 'zod'

import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import { AccountTransactionEntrySchema } from '../account-transaction-entry'

export const AccountTransactionSchema = z.object({
    id: entityIdSchema.optional(),
    jv_number: z.coerce.string().min(1).max(255),

    created_at: z.coerce.string(),

    source: z.any(),

    date: z.any(),

    debit: z.coerce.number<number>(),
    credit: z.coerce.number<number>(),

    description: z.coerce.string().optional(),

    entries: z.array(AccountTransactionEntrySchema),
})

export const AccountTransactionGenerateSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,
    })
    .superRefine((data, ctx) => {
        if (data.start_date !== undefined && data.end_date !== undefined) {
            if (data.start_date > data.end_date) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Start Date must not be greater than End Date',
                    path: ['start_date'],
                })
                ctx.addIssue({
                    code: 'custom',
                    message: 'To Date must not be less than Start Date',
                    path: ['end_date'],
                })
            }
        }
    })

export type TAccountTransactionSchema = z.infer<typeof AccountTransactionSchema>
export type TAccountTransactionGenerateSchema = z.infer<
    typeof AccountTransactionGenerateSchema
>
