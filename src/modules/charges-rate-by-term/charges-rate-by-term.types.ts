import { ITimeStamps, TEntityId } from '@/types/common'

import { IBranch } from '../branch'
import { IChargesRateSchemeRequest } from '../charges-rate-scheme'
import { IOrganization } from '../organization'

export type TChargesModeOfPaymentType =
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'quarterly'
    | 'semi-annually'
    | 'annually'
    | 'lumpsum'

export interface IChargesRateByTerm {
    id: string
    organization_id: string
    branch_id: string
    charges_rate_scheme_id: string

    name: string
    description: string
    mode_of_payment: TChargesModeOfPaymentType

    rate_1: number
    rate_2: number
    rate_3: number
    rate_4: number
    rate_5: number
    rate_6: number
    rate_7: number
    rate_8: number
    rate_9: number
    rate_10: number
    rate_11: number
    rate_12: number
    rate_13: number
    rate_14: number
    rate_15: number
    rate_16: number
    rate_17: number
    rate_18: number
    rate_19: number
    rate_20: number
    rate_21: number
    rate_22: number
}

export interface IChargesRateByTermResponse
    extends IChargesRateByTerm,
        ITimeStamps {
    created_by_id: TEntityId
    updated_by_id: TEntityId

    created_by?: TEntityId
    updated_by?: TEntityId
    organization?: IOrganization
    branch?: IBranch
    charges_rate_scheme?: IChargesRateSchemeRequest
}

export interface IChargesRateByTermRequest {
    charges_rate_scheme_id: string
    name?: string
    description?: string
    mode_of_payment?: string
    rate_1?: number
    rate_2?: number
    rate_3?: number
    rate_4?: number
    rate_5?: number
    rate_6?: number
    rate_7?: number
    rate_8?: number
    rate_9?: number
    rate_10?: number
    rate_11?: number
    rate_12?: number
    rate_13?: number
    rate_14?: number
    rate_15?: number
    rate_16?: number
    rate_17?: number
    rate_18?: number
    rate_19?: number
    rate_20?: number
    rate_21?: number
    rate_22?: number
}
