import { IBaseEntityMeta, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'

export interface ILoanStatus extends IBaseEntityMeta {
    name: string
    icon: string
    color: string
    description: string
}

export interface ILoanStatusRequest {
    id?: TEntityId

    branch_id?: TEntityId
    organization_id?: TEntityId

    name: string
    icon: string
    color: string
    description: string
}

export interface ILoanStatusPaginated extends IPaginatedResult<ILoanStatus> {}
