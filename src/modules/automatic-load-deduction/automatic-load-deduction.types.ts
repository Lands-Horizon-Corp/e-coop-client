import z from 'zod'

import { IBaseEntityMeta, TEntityId } from '../common'
import { entityIdSchema, stringDateWithTransformSchema } from '../common'

export interface IAutomaticLoanDeductionBase {
    loan_id: TEntityId
    member_id: TEntityId
    deduction_amount: number
    deduction_date: string
    is_posted: boolean
}

export interface IAutomaticLoanDeduction
    extends IAutomaticLoanDeductionBase,
        IBaseEntityMeta {}

export const AutomaticLoanDeductionSchema = z.object({
    loan_id: entityIdSchema,
    member_id: entityIdSchema,
    deduction_amount: z
        .number()
        .positive('Deduction must be greater than zero')
        .max(500000000, 'Deduction cannot exceed Five Hundred Million'),
    deduction_date: stringDateWithTransformSchema,
    is_posted: z.boolean().default(false),
})
