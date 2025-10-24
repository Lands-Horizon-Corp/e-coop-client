import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { AccountTypeEnum, IAccount } from '../account'
import { IChargesRateScheme } from '../charges-rate-scheme'
import { IComputationSheet } from '../computation-sheet'
import { AutomaticLoanDeductionSchema } from './automatic-loan-deduction.validation'

export interface IAutomaticLoanDeduction extends IBaseEntityMeta {
    account_id: TEntityId
    account: IAccount

    computation_sheet_id: TEntityId
    computation_sheet: IComputationSheet

    description: string

    //CHARGES
    charges_percentage_1: number
    charges_percentage_2: number
    charges_amount: number
    charges_divisor: number

    min_amount: number
    max_amount: number

    anum: number // months , if naka 1 compute interest based number of months
    // number_of_months integer

    charges_rate_scheme_id?: TEntityId
    charges_rate_scheme?: IChargesRateScheme

    add_on: boolean // add onn para buo loan
    ao_rest: boolean // def: false
    exclude_renewal: boolean //def false
    ct: number // TODO: unknown, wtf is this?
}

export type IAutomaticLoanDeductionRequest = z.infer<
    typeof AutomaticLoanDeductionSchema
>

export interface IAutomaticLoanDeductionPaginated
    extends IPaginatedResult<IAutomaticLoanDeduction> {}

// For computation of deduction entry amount/values
export type AutomaticLoanDeductionEntry = {
    charges_percentage_1: number
    charges_percentage_2: number
    charges_amount: number
    charges_divisor: number

    account_type?: AccountTypeEnum // for checking
    interest_standard?: number // use this if charges_perc_1 & 2 no value

    min_amount: number
    max_amount: number

    anum: number
    number_of_months: number
}

export type LoanTransaction = {
    terms: number
    applied_1: number
    is_add_on: boolean
}
