import { IPaginatedResult } from '../paginated-result'
import { IBaseEntityMeta, TEntityId } from '../../common'

// LATEST FROM ERD
export interface IMemberGender extends IBaseEntityMeta {
    id: TEntityId

    name: string
    description: string
}

export interface IMemberGenderRequest {
    id?: TEntityId

    name: string
    description: string
}

export interface IMemberGenderPaginated
    extends IPaginatedResult<IMemberGender> {}
