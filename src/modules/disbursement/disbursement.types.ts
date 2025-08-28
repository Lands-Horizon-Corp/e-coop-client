import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

export interface IDisbursement extends IBaseEntityMeta {
    organization_id: TEntityId
    branch_id: TEntityId

    name: string
    icon?: string
    description?: string
}

export interface IDisbursementRequest {
    id?: TEntityId

    organization_id?: TEntityId
    branch_id?: TEntityId

    name: string
    icon?: string
    description?: string
}

export interface IDisbursementPaginated
    extends IPaginatedResult<IDisbursement> {}
