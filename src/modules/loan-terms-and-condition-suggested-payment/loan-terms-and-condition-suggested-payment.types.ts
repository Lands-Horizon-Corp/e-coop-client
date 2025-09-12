import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { LoanTermsAndConditionSuggestedPaymentSchema } from './loan-terms-and-condition-suggested-payment.validation'

export interface ILoanTermsAndConditionSuggestedPayment
    extends IBaseEntityMeta {
    loan_transaction_id: TEntityId
    name: string
    description: string
}

export type ILoanTermsAndConditionSuggestedPaymentRequest = z.infer<
    typeof LoanTermsAndConditionSuggestedPaymentSchema
>

export interface ILoanTermsAndConditionSuggestedPaymentPaginated
    extends IPaginatedResult<ILoanTermsAndConditionSuggestedPayment> {}
