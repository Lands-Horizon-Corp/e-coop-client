import { IBaseEntityMeta, TEntityId } from '@/types/common'

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
