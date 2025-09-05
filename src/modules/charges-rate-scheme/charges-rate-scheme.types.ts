import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { ChargesRateByTermHeaderRequest } from '../charges-rate-by-term-header'
import { IChargesRateMemberTypeModeOfPaymentResponse } from '../charges-rate-scheme-mode-of-payment'

export interface IChargesRateSchemeRequest {
    charges_rate_by_term_header_id?: TEntityId
    charges_rate_member_type_mode_of_payment_id?: TEntityId
    name: string
    description: string
}

export interface IChargesRateSchemeResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    charges_rate_by_term_header_id: TEntityId
    charges_rate_by_term_header?: ChargesRateByTermHeaderRequest
    charges_rate_member_type_mode_of_payment_id: TEntityId
    charges_rate_member_type_mode_of_payment?: IChargesRateMemberTypeModeOfPaymentResponse
    name: string
    description: string
}
