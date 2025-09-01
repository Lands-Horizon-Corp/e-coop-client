import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IComputationSheet } from '../computation-sheet'
import { AutomaticLoanDeductionSchema } from './automatic-loan-deduction.validation'

export interface IAutomaticLoanDeduction extends IBaseEntityMeta {
    account_id: TEntityId
    account: IAccount

    computation_sheet_id: TEntityId
    computation_sheet: IComputationSheet

    //CHARGES
    charges_percentage_1: number
    charges_percentage_2: number
    charges_amount: number
    charges_divisor: number

    min_amount: number
    max_amount: number

    anum: number // months , if naka 1 compute interest based number of months
    // number_of_months integer
    link_account_id?: TEntityId
    link_account?: IAccount

    add_on: boolean // add onn para buo loan
    ao_rest: boolean // def: false
    exclude_renewal: boolean //def false
    ct: number // TODO: unknown, wtf is this?

    name: string
    description: string
}

export type IAutomaticLoanDeductionRequest = z.infer<
    typeof AutomaticLoanDeductionSchema
>

export interface IAutomaticLoanDeductionPaginated
    extends IPaginatedResult<IAutomaticLoanDeduction> {}
