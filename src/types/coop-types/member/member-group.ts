import { IBaseEntityMeta, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'

export interface IMemberGroup extends IBaseEntityMeta {
    id: TEntityId

    name: string
    description: string
}

export interface IMemberGroupRequest {
    id?: TEntityId

    name: string
    description: string

    // organization_id: TEntityId
    // branch_id: TEntityId
}

export interface IMemberGroupPaginated extends IPaginatedResult<IMemberGroup> {}
