import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { LoanClearanceAnalysisInstitutionSchema } from './loan-clearance-analysis-institution.validation'

export interface ILoanClearanceAnalysisInstitution extends IBaseEntityMeta {
    loan_transaction_id?: TEntityId
    name: string
    description: string
}

export type ILoanClearanceAnalysisInstitutionRequest = z.infer<
    typeof LoanClearanceAnalysisInstitutionSchema
>

export interface ILoanClearanceAnalysisInstitutionPaginated
    extends IPaginatedResult<ILoanClearanceAnalysisInstitution> {}
