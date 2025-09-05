import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'
import { IChargesRateSchemeResponse } from '../charges-rate-scheme'

export interface IChargesRateSchemeAccountRequest {
    charges_rate_scheme_id: TEntityId
    account_id: TEntityId
}

export interface IChargesRateSchemeAccountResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    charges_rate_scheme_id: TEntityId
    charges_rate_scheme?: IChargesRateSchemeResponse
    account_id: TEntityId
    account?: IAccount
}
