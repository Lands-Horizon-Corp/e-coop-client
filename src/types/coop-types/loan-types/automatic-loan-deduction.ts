import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IAccount } from '../accounts/account'
import { IPaginatedResult } from '../paginated-result'
import { IComputationSheet } from './computation-sheet'

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

export interface IAutomaticLoanDeductionRequest {
    id?: TEntityId

    account_id: TEntityId
    computation_sheet_id: TEntityId

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

    add_on: boolean // add onn para buo loan
    ao_rest: boolean // def: false
    exclude_renewal: boolean //def false
    ct?: number // TODO: unknown, wtf is this?

    name: string
    description?: string
}

export interface IAutomaticLoanDeductionPaginated
    extends IPaginatedResult<IAutomaticLoanDeduction> {}
