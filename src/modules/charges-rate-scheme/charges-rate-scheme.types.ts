import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IChargesRateByRangeOrMinimumAmount } from '../charges-by-range-or-minimum-amount'
import { IChargesRateByTerm } from '../charges-rate-by-term'
import { IChargesRateByTermHeader } from '../charges-rate-by-term-header'
import { IChargesRateSchemeAccount } from '../charges-rate-scheme-account'
import { IChargesRateSchemeModeOfPayment } from '../charges-rate-scheme-mode-of-payment'
import { IMemberType } from '../member-type'
import { ChargesRateSchemeSchema } from './charges-rate-scheme.validation'

export type ChargesRateMemberTypeEnum = 'all' | string

export interface IChargesRateScheme extends IBaseEntityMeta {
    charges_rate_by_term_header_id: string
    charges_rate_by_term_header?: IChargesRateByTermHeader

    name: string
    description: string
    icon: string

    charges_rate_scheme_accounts?: IChargesRateSchemeAccount[]
    charges_rate_by_range_or_minimum_amounts?: IChargesRateByRangeOrMinimumAmount[]
    charges_rate_scheme_mode_of_payments?: IChargesRateSchemeModeOfPayment[]
    charges_rate_by_terms?: IChargesRateByTerm[]

    member_type_id: TEntityId
    member_type?: IMemberType
    mode_of_payment: ChargesRateMemberTypeEnum

    mode_of_payment_header_1: number
    mode_of_payment_header_2: number
    mode_of_payment_header_3: number
    mode_of_payment_header_4: number
    mode_of_payment_header_5: number
    mode_of_payment_header_6: number
    mode_of_payment_header_7: number
    mode_of_payment_header_8: number
    mode_of_payment_header_9: number
    mode_of_payment_header_10: number
    mode_of_payment_header_11: number
    mode_of_payment_header_12: number
    mode_of_payment_header_13: number
    mode_of_payment_header_14: number
    mode_of_payment_header_15: number
    mode_of_payment_header_16: number
    mode_of_payment_header_17: number
    mode_of_payment_header_18: number
    mode_of_payment_header_19: number
    mode_of_payment_header_20: number
    mode_of_payment_header_21: number
    mode_of_payment_header_22: number

    by_term_header_1: number
    by_term_header_2: number
    by_term_header_3: number
    by_term_header_4: number
    by_term_header_5: number
    by_term_header_6: number
    by_term_header_7: number
    by_term_header_8: number
    by_term_header_9: number
    by_term_header_10: number
    by_term_header_11: number
    by_term_header_12: number
    by_term_header_13: number
    by_term_header_14: number
    by_term_header_15: number
    by_term_header_16: number
    by_term_header_17: number
    by_term_header_18: number
    by_term_header_19: number
    by_term_header_20: number
    by_term_header_21: number
    by_term_header_22: number
}

export type IChargesRateSchemeRequest = z.infer<typeof ChargesRateSchemeSchema>

export interface IChargesRateSchemePaginated
    extends IPaginatedResult<IChargesRateScheme> {}
