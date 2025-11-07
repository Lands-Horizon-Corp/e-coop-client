import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { TMockCloanInputSchema } from '../calculator'
import { ICurrency } from '../currency'
import { ILoanAmortizationSchedule } from '../loan-amortization-schedule'
import { ComputationSheetSchema } from './computation-sheet.validation'

export interface IComputationSheet extends IBaseEntityMeta {
    name: string
    description?: string

    deliquent_account: boolean
    fines_account: boolean
    interest_account: boolean
    comaker_account: number
    exist_account: boolean

    currency_id: TEntityId
    currency: ICurrency

    created_at: string
    updated_at: string
    deleted_at?: string
}

export type IComputationSheetRequest = z.infer<typeof ComputationSheetSchema>

export interface IComputationSheetPaginated
    extends IPaginatedResult<IComputationSheet> {}

// FOR CALCULATOR USE ONLY
// Payload for computing amortization of a specific computation sheet
export type IComputationSheetAmortizationResponseRequest = TMockCloanInputSchema

export interface IComputationSheetAmortizationResponseDeduction {
    account: IAccount
    name?: string
    description?: string
    is_add_on: boolean
    type: 'static' | 'deduction' | 'add-on'
    credit: number
    debit: number
}

export interface IComputationSheetAmortizationResponse {
    entries: IComputationSheetAmortizationResponseDeduction[]
    total_debit: number
    total_credit: number

    schedule: ILoanAmortizationSchedule[]
}
