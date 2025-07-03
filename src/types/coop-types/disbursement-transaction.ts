import { IAuditable, ITimeStamps, TEntityId } from '@/types/common'
import { IPaginatedResult } from './paginated-result'

export interface IDisbursementTransaction extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    disbursement_id?: TEntityId
    transaction_batch_id?: TEntityId

    employee_user_id?: TEntityId

    transaction_reference_number?: string
    reference_number?: string

    amount: number
}

export interface IDisbursementTransactionRequest {
    organization_id: TEntityId
    branch_id: TEntityId

    disbursement_id?: TEntityId
    transaction_batch_id?: TEntityId

    employee_user_id?: TEntityId

    transaction_reference_number?: string
    reference_number?: string

    amount: number
}

export interface IDisbursementTransactionPaginated
    extends IPaginatedResult<IDisbursementTransaction> {}
