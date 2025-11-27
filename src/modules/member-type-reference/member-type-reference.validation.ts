import z from 'zod'

import {
    EntityIdSchema,
    PercentageSchema,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

import { MEMBER_TYPE_REFERENCE_TYPE } from './member-type-reference.constant'

export const MemberTypeReferenceSchema = z
    .object({
        id: entityIdSchema.optional(),
        member_type_id: EntityIdSchema('Member type is required'),

        name: z.coerce.string().min(1, 'Name is required'),

        description: descriptionSchema.transform(
            descriptionTransformerSanitizer
        ),
        account_id: EntityIdSchema('Account is required'),
        account: z.any(),

        interest_rate: PercentageSchema.optional(),
        charges: z.coerce.number().min(0, 'Charges are required').optional(),

        minimum_balance: z.coerce
            .number()
            .min(0, 'Minimum balance is required'),
        maintaining_balance: z.coerce
            .number()
            .min(0, 'Maintaining balance is required'),

        other_interest_on_saving_computation_minimum_balance: z.coerce
            .number()
            .min(0)
            .optional(),
        other_interest_on_saving_computation_interest_rate:
            PercentageSchema.optional(),

        type: z.enum(MEMBER_TYPE_REFERENCE_TYPE).default('None'),
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

export type TMemberTypeReferenceSchema = z.infer<
    typeof MemberTypeReferenceSchema
>
