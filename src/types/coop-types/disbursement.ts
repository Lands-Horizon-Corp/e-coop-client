import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IPaginatedResult } from './paginated-result'

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
