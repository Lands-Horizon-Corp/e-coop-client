import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import { IEmployee } from '../user'
import { ITransactionBatch } from '../transaction-batch'
import { IDisbursement } from '../disbursement/disbursement.types'

export interface IDisbursementTransaction extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    disbursement_id?: TEntityId
    disbursement?: IDisbursement

    transaction_batch_id?: TEntityId
    transaction_batch?: ITransactionBatch

    employee_user_id?: TEntityId
    employee_user?: IEmployee

    transaction_reference_number?: string
    reference_number?: string

    amount: number
}

export interface IDisbursementTransactionRequest {
    id?: TEntityId
    transaction_batch_id?: TEntityId
    disbursement_id?: TEntityId
    description?: string
    is_reference_number_checked: boolean
    reference_number: string
    amount: number
}

export interface IDisbursementTransactionPaginated
    extends IPaginatedResult<IDisbursementTransaction> {}
