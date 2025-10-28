import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IChargesRateScheme } from '../charges-rate-scheme'
import { TLoanModeOfPayment } from '../loan-transaction'
import { TChargesRateByTermSchema } from './charges-rate-by-term.validation'

export type TChargesModeOfPaymentType =
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'quarterly'
    | 'semi-annually'
    | 'annually'
    | 'lumpsum'

export interface IChargesRateByTerm extends IBaseEntityMeta {
    charges_rate_scheme_id: TEntityId
    charges_rate_scheme?: IChargesRateScheme
    mode_of_payment: TLoanModeOfPayment
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

export type IChargesRateByTermRequest = TChargesRateByTermSchema
