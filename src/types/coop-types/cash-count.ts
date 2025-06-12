import { IUserBase } from '../auth'
import { IBaseEntityMeta, TEntityId } from '../common'

export interface ICashCount extends IBaseEntityMeta {
    id: TEntityId

    employee_user_id?: string
    employee_user?: IUserBase

    transaction_batch_id?: string

    country_code: string
    bill_amount: number
    quantity: number
    amount: number
}

export interface ICashCountRequest {
    id?: TEntityId

    organization_id?: TEntityId
    branch_id?: TEntityId
    transaction_batch_id?: TEntityId

    employee_user_id?: TEntityId

    country_code: string
    bill_amount: number
    quantity: number
    amount: number
}

export interface ICashCountBatchRequest {
    cash_counts: ICashCountRequest[]
    deleted_cash_counts?: TEntityId[]
    deposit_in_bank?: number
    cash_count_total?: number
    grand_total?: number
}
