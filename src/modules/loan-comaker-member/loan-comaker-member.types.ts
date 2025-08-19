import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { ILoanTransaction } from '../loan-transaction'
import { IMemberProfile } from '../member-profile'

export interface ILoanClearanceAnalysisRequest {
    loan_transaction_id: TEntityId
    regular_deduction_description?: string
    regular_deduction_amount?: number
    balances_description?: string
    balances_amount?: number
    balances_count?: number
}

export interface ILoanClearanceAnalysisResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
    regular_deduction_description: string
    regular_deduction_amount: number
    balances_description: string
    balances_amount: number
    balances_count: number
}

export const loanClearanceAnalysisRequestSchema = z.object({
    loan_transaction_id: entityIdSchema,
    regular_deduction_description: z.string().optional(),
    regular_deduction_amount: z.number().optional(),
    balances_description: z.string().optional(),
    balances_amount: z.number().optional(),
    balances_count: z.number().optional(),
})

export interface ILoanClearanceAnalysisInstitutionRequest {
    loan_transaction_id: TEntityId
    name: string
    description?: string
}

export interface ILoanClearanceAnalysisInstitutionResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
    name: string
    description: string
}

export const loanClearanceAnalysisInstitutionRequestSchema = z.object({
    loan_transaction_id: entityIdSchema,
    name: z.string().min(1).max(50),
    description: z.string().optional(),
})

export interface ILoanComakerMemberRequest {
    member_profile_id: TEntityId
    loan_transaction_id: TEntityId
    description?: string
    amount?: number
    months_count?: number
    year_count?: number
}

export interface ILoanComakerMemberResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
    description: string
    amount: number
    months_count: number
    year_count: number
}

export const loanComakerMemberRequestSchema = z.object({
    member_profile_id: entityIdSchema,
    loan_transaction_id: entityIdSchema,
    description: z.string().optional(),
    amount: z.number().optional(),
    months_count: z.number().optional(),
    year_count: z.number().optional(),
})
