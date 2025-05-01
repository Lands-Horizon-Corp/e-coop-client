import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'

export interface IAccountsComputationTypeRequest {
    id: TEntityId
    companyId: TEntityId
    name: string
    description: string
}

export interface IAccountsComputationTypeResource extends ITimeStamps {
    id: TEntityId
    companyId: TEntityId
    name: string
    description: string
    createdBy: TEntityId
    updatedBy: TEntityId
}

export interface IAccountsComputationTypePaginatedResource
    extends IPaginatedResult<IAccountsComputationTypeResource> {}
