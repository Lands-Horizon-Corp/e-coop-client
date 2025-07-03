import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export interface IAccountCategory extends IAuditable, ITimeStamps {
    id: TEntityId

    name: string
    description?: string

    organization_id: TEntityId
    branch_id: TEntityId
}

export interface IAccountCategoryRequest {
    name: string
    description?: string

    organization_id?: TEntityId
    branch_id?: TEntityId
}

export interface IAccountCategoryPaginated
    extends IPaginatedResult<IAccountCategory> {}
