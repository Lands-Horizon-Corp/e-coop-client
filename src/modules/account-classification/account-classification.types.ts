import { IAuditable, IPaginatedResult, ITimeStamps, TEntityId } from '@/types'

export interface IAccountClassification extends IAuditable, ITimeStamps {
    id: TEntityId

    name: string
    description?: string

    organization_id: TEntityId
    branch_id: TEntityId
}

export interface IAccountClassificationRequest {
    name: string
    description?: string

    organization_id?: TEntityId
    branch_id?: TEntityId
}

export interface IAccountClassificationPaginated
    extends IPaginatedResult<IAccountClassification> {}
