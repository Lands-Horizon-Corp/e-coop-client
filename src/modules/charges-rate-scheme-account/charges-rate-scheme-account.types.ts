import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'
import { IChargesRateScheme } from '../charges-rate-scheme'

export interface IChargesRateSchemeAccountRequest {
    charges_rate_scheme_id: TEntityId
    account_id: TEntityId
}

export interface IChargesRateSchemeAccount
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    charges_rate_scheme_id: TEntityId
    charges_rate_scheme?: IChargesRateScheme
    account_id: TEntityId
    account?: IAccount
}
