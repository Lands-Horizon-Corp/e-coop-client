import { IBaseEntityMeta, TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export interface ICollateral extends IBaseEntityMeta {
    icon: string

    name: string
    description: string
}

export interface ICollateralRequest {
    id?: TEntityId
    icon: string

    name: string
    description: string
}

export interface ICollateralPaginated extends IPaginatedResult<ICollateral> {}
