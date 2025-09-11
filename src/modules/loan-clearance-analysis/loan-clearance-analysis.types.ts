import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { LoanClearanceAnalysisSchema } from './loan-clearance-analysis.validation'

export interface ILoanClearanceAnalysis extends IBaseEntityMeta {
    loan_transaction_id: TEntityId
    regular_deduction_description: string
    regular_deduction_amount: number
    balances_description: string
    balances_amount: number
    balances_count: number
}

export type ILoanClearanceAnalysisRequest = z.infer<
    typeof LoanClearanceAnalysisSchema
>

export interface ILoanClearanceAnalysisPaginated
    extends IPaginatedResult<ILoanClearanceAnalysis> {}
