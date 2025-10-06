import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IAmortizationPayment, IAmortizationSummary } from '../amortization'
import { TLoanModeOfPayment } from '../loan-transaction'
import { ComputationSheetSchema } from './computation-sheet.validation'

export interface IComputationSheet extends IBaseEntityMeta {
    name: string
    description?: string

    deliquent_account: boolean
    fines_account: boolean
    interest_account: boolean
    comaker_account: number
    exist_account: boolean

    created_at: string
    updated_at: string
    deleted_at?: string
}

export type IComputationSheetRequest = z.infer<typeof ComputationSheetSchema>

export interface IComputationSheetPaginated
    extends IPaginatedResult<IComputationSheet> {}

// FOR CALCULATOR USE ONLY
// Payload for computing amortization of a specific computation sheet
export interface IComputationSheetCalculatorRequest {
    terms: number
    account_id: TEntityId
    mode_of_payment: TLoanModeOfPayment
    fixed_days?: number
    weekdays?: number
    pay_1?: number
    pay_2?: number
    applied_1: number
    is_add_on: boolean

    exclude_holidays?: boolean
    exclude_saturdays?: boolean
    exclude_sundays?: boolean
}

export interface IComputationSheetCalculatorDeduction {
    account: IAccount
    name?: string
    description?: string
    is_add_on: boolean
    type: 'static' | 'deduction' | 'add-on'
    credit: number
    debit: number
}

export interface IComputationSheetCalculator {
    entries: IComputationSheetCalculatorDeduction[]
    total_debit: number
    total_credit: number
    amortization: {
        amortizations: IAmortizationPayment[]
        amortization_summary: IAmortizationSummary
    }
}
