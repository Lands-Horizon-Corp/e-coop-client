import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { ICurrency } from '../currency'
import { TDisbursementSchema } from './disbursement.validation'

export interface IDisbursement extends IBaseEntityMeta {
    organization_id: TEntityId
    branch_id: TEntityId

    name: string
    icon?: string
    description?: string

    currency: ICurrency
    currency_id: TEntityId
}

export type IDisbursementRequest = TDisbursementSchema

export interface IDisbursementPaginated
    extends IPaginatedResult<IDisbursement> {}
