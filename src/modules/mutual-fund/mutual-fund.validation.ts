import z from 'zod'

import {
    EntityIdSchema,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'

import { MUTUAL_FUND_COMPUTATION_TYPES } from './mutual-fund.constant'

export const MutualFundSchema = z.object({
    id: entityIdSchema.optional(),
    mutual_aid_contribution_id: z.string().uuid().optional(),

    member_profile_id: EntityIdSchema('Invalid member profile'),
    member_profile: z.any().optional(),

    name: z.string().min(1).max(255),
    description: z.string().optional(),
    date_of_death: stringDateWithTransformSchema,
    amount: z.number().gte(0),
    computation_type: z.enum(MUTUAL_FUND_COMPUTATION_TYPES),
    extension_only: z.boolean(),
})

export type TMutualFundSchema = z.infer<typeof MutualFundSchema>
