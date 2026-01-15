import z from 'zod'

import {
    EntityIdSchema,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'

import { MutualFundAdditionalMembersSchema } from '../mutual-fund-additional-members'
import { MutualFundTableSchema } from '../mutual-fund-table'
import { MUTUAL_FUND_COMPUTATION_TYPES } from './mutual-fund.constant'

export const MutualFundSchema = z.object({
    id: entityIdSchema.optional(),
    mutual_aid_contribution_id: z.string().uuid().optional(),

    member_profile_id: EntityIdSchema('Invalid member profile'),
    member_profile: z.any().optional(),

    account_id: EntityIdSchema('Account ID is required'),
    account: z.any(),

    name: z.string().min(1).max(255),
    description: z.string().optional(),
    date_of_death: stringDateWithTransformSchema,
    amount: z.coerce
        .number('Invalid amount')
        .min(1, 'Amount must be at least 1'),
    computation_type: z.enum(MUTUAL_FUND_COMPUTATION_TYPES),
    extension_only: z.boolean().default(false),

    mutual_fund_additional_members: z
        .array(MutualFundAdditionalMembersSchema)
        .optional(),
    mutual_fund_additional_members_delete_ids: z
        .array(entityIdSchema)
        .optional(),

    mutual_fund_tables: z.array(MutualFundTableSchema).optional(),
    mutual_fund_table_delete_ids: z.array(entityIdSchema).optional(),

    // for view only
    mutual_fund_entries: z.array(z.any()).optional(),
    is_viewing_entries: z.boolean().optional(),
    total_amount: z.coerce.number().default(0),
})

export type TMutualFundSchema = z.infer<typeof MutualFundSchema>

export const MutualFundViewSchema = MutualFundSchema.omit({
    mutual_fund_entries: true,
})
export type TMutualFundViewSchema = z.infer<typeof MutualFundViewSchema>

export const MutualFundViewPostRequestSchema = z.object({
    check_voucher_number: z.string().optional(),

    post_account_id: EntityIdSchema('Invalid post account').optional(),
    post_account: z.any(),

    entry_date: stringDateWithTransformSchema.optional(),
})

export type TMutualFundViewPostRequestSchema = z.infer<
    typeof MutualFundViewPostRequestSchema
>

export const MutualFundPrintSchema = z.object({
    sort_by: z.string(),
    report_format: z.string(),
})

export type TMutualFundPrintSchema = z.infer<typeof MutualFundPrintSchema>
