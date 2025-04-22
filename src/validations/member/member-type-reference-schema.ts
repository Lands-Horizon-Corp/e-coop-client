import z from 'zod'
import { entityIdSchema } from '../common'

export const createMemberTypeReferenceSchema = z.object({
    id: entityIdSchema.optional(),
    accountId: entityIdSchema,
    memberTypeId: entityIdSchema,

    description: z.string().optional(),

    maintainingBalance: z.coerce
        .number()
        .nonnegative('Maintaining Balance must be zero or positive')
        .default(0),
    minimumBalance: z.coerce
        .number()
        .nonnegative('Minimum Balance must be zero or positive'),
    interestRate: z.coerce
        .number()
        .min(0, 'Interest Rate must be at least 0')
        .max(100, 'Interest Rate must be less than or equal to 100')
        .default(0),
    charges: z.coerce.number().nonnegative('Charges must be zero or positive'),

    activeMemberMinimumBalance: z.coerce
        .number()
        .nonnegative('Active Member Minimum Balance must be zero or positive')
        .default(0),

    activeMemberRatio: z.coerce
        .number()
        .min(0, 'Active Member Ratio must be at least 0')
        .max(1, 'Active Member Ratio must not exceed 1')
        .default(0),

    otherInterestOnSavingComputationMinimumBalance: z.coerce
        .number()
        .nonnegative('Minimum Balance must be zero or positive')
        .default(0),

    otherInterestOnSavingComputationInterestRate: z.coerce
        .number()
        .min(0, 'Interest Rate must be at least 0')
        .max(100, 'Interest Rate must be less than or equal to 100')
        .default(0),
})
