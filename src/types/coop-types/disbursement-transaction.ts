import { IAuditable, ITimeStamps, TEntityId } from '@/types/common'

import { IEmployee } from '../auth'
import { IDisbursement } from './disbursement'
import { IPaginatedResult } from './paginated-result'
import { ITransactionBatch } from './transaction-batch'

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

    organization_id?: TEntityId
    branch_id?: TEntityId

    disbursement_id?: TEntityId
    transaction_batch_id?: TEntityId

    employee_user_id?: TEntityId

    transaction_reference_number?: string
    reference_number?: string

    amount: number
}

export interface IDisbursementTransactionPaginated
    extends IPaginatedResult<IDisbursementTransaction> {}
