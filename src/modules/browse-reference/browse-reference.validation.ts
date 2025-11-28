import z from 'zod'

import {
    EntityIdSchema,
    PercentageSchema,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

import { InterestRateByAmountSchema } from '../interest-rate-by-amount'
import { InterestRateByDateSchema } from '../interest-rate-by-date'
import { InterestRateByYearSchema } from '../interest-rate-by-year'
import { INTEREST_TYPE } from './browse-reference.constant'

// import { INTEREST_TYPE } from './member-type-reference.constant'

const BaseBrowseReferenceSchema = z
    .object({
        id: entityIdSchema.optional(),

        member_type: z.any(),
        member_type_id: EntityIdSchema('Member type is required'),

        name: z.coerce.string().min(1, 'Name is required'),

        description: descriptionSchema.transform(
            descriptionTransformerSanitizer
        ),

        account_id: EntityIdSchema('Account is required'),
        account: z.any(),

        interest_type: z.enum(INTEREST_TYPE).default('none'),
        interest_rate: PercentageSchema.optional(),
        charges: z.coerce.number().min(0, 'Charges are required').optional(),

        minimum_balance: z.coerce
            .number()
            .min(0, 'Minimum balance is required'),

        other_interest_on_saving_computation_minimum_balance: z.coerce
            .number()
            .min(0)
            .optional(),
        other_interest_on_saving_computation_interest_rate:
            PercentageSchema.optional(),
    })
    .superRefine((data, ctx) => {
        const hasCharges = data?.charges && data?.charges > 0
        const hasInterestRate = data?.interest_rate && data?.interest_rate > 0

        if (hasCharges && hasInterestRate) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'Only one of charges or interest rate can have a value at the same time',
                path: ['charges'],
            })
            ctx.addIssue({
                code: 'custom',
                message:
                    'Only one of charges or interest rate can have a value at the same time',
                path: ['interest_rate'],
            })
        }
    })

export const WithInterestType = z.discriminatedUnion('interest_type', [
    z.object({
        interest_type: z.literal('year'),
        interest_rates_by_year: z
            .array(InterestRateByYearSchema)
            .min(1, 'At least one interest rate by year is required'),
        interest_rates_by_year_deleted: z.array(entityIdSchema).optional(),
    }),
    z.object({
        interest_type: z.literal('date'),
        interest_rates_by_date: z
            .array(InterestRateByDateSchema)
            .min(1, 'At least one interest rate by date is required'),
        interest_rates_by_date_deleted: z.array(entityIdSchema).optional(),
    }),
    z.object({
        interest_type: z.literal('amount'),
        interest_rates_by_amount: z
            .array(InterestRateByAmountSchema)
            .min(1, 'At least one interest rate by amount is required'),
        interest_rates_by_amount_deleted: z.array(entityIdSchema).optional(),
    }),
    z.object({
        interest_type: z.enum(
            INTEREST_TYPE.filter(
                (val) => !['year', 'date', 'amount'].includes(val)
            )
        ),
    }),
])

export const BrowseReferenceSchema =
    BaseBrowseReferenceSchema.and(WithInterestType)

export type TBrowseReferenceSchema = z.infer<typeof BrowseReferenceSchema>
