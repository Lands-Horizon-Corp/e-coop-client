import { IPaginatedResult } from '../paginated-result'
import { IBaseEntityMeta, TEntityId } from '@/types/common'

export interface ILoanPurpose extends IBaseEntityMeta {
    description: string
    icon: string
}

export interface ILoanPurposeRequest {
    id?: TEntityId

    branch_id?: TEntityId
    organization_id?: TEntityId

    icon: string
    description: string
}

export interface ILoanPurposePaginated extends IPaginatedResult<ILoanPurpose> {}
