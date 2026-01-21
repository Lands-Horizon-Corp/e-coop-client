import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { LoanTermsAndConditionAmountReceiptSchema } from './loan-terms-and-condition-amount-receipt.validation'

export interface ILoanTermsAndConditionAmountReceipt extends IBaseEntityMeta {
    loan_transaction_id?: TEntityId // auto inserted by server
    account_id: TEntityId
    account: IAccount
    amount: number
}

export type ILoanTermsAndConditionAmountReceiptRequest = z.infer<
    typeof LoanTermsAndConditionAmountReceiptSchema
>

export interface ILoanTermsAndConditionAmountReceiptPaginated
    extends IPaginatedResult<ILoanTermsAndConditionAmountReceipt> {}
