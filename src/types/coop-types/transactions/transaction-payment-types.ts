import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'

export interface ITransactionPaymentTypesRequest {
    id?: TEntityId
    name: string
    description: TEntityId
    chequeId: TEntityId
}

export interface ITransactionPaymentTypesResource extends ITimeStamps {
    id: TEntityId
    name: string
    description: TEntityId
    chequeId: TEntityId
}

export interface ITransactionPaymentTypePaginatedResource
    extends IPaginatedResult<ITransactionPaymentTypesResource> {}
