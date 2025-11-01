import z from 'zod'

import {
    DaySchema,
    EntityIdSchema,
    PercentageSchema,
    entityIdSchema,
} from '@/validation'

import { timeDepositComputationSchema } from '../time-deposit-computation'
import { TimeDepositComputationPreMatureSchema } from '../time-deposit-computation-pre-mature'

export const timeDepositTypeCreateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().optional(),

    currency_id: EntityIdSchema('Currency is required'),
    currency: z.any().optional(),

    pre_mature: z.coerce.number().optional(),
    pre_mature_rate: PercentageSchema.optional(),
    excess: z.coerce.number().optional(),
})

export type TTimeDepositTypeCreateSchema = z.infer<
    typeof timeDepositTypeCreateSchema
>

export const timeDepositTypeSchema = timeDepositTypeCreateSchema.extend({
    header_1: DaySchema.optional(),
    header_2: DaySchema.optional(),
    header_3: DaySchema.optional(),
    header_4: DaySchema.optional(),
    header_5: DaySchema.optional(),
    header_6: DaySchema.optional(),
    header_7: DaySchema.optional(),
    header_8: DaySchema.optional(),
    header_9: DaySchema.optional(),
    header_10: DaySchema.optional(),
    header_11: DaySchema.optional(),

    time_deposit_computations: z.array(timeDepositComputationSchema).optional(),
    time_deposit_computations_deleted: z.array(entityIdSchema).optional(),

    time_deposit_computations_pre_mature: z
        .array(TimeDepositComputationPreMatureSchema)
        .optional(),
    time_deposit_computations_pre_mature_deleted: z
        .array(entityIdSchema)
        .optional(),
})

export type TTimeDepositTypeSchema = z.infer<typeof timeDepositTypeSchema>
