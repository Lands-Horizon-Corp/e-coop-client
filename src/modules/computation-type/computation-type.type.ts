import { IPaginatedResult, ITimeStamps, TEntityId } from '@/types'

export interface IAccountsComputationTypeRequest {
    id: TEntityId
    companyId: TEntityId
    name: string
    description: string
}

export interface IAccountsComputationType extends ITimeStamps {
    id: TEntityId
    companyId: TEntityId
    name: string
    description: string
    createdBy: TEntityId
    updatedBy: TEntityId
}

export interface IAccountsComputationTypePaginated
    extends IPaginatedResult<IAccountsComputationType> {}
