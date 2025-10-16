import { IChargesRateScheme } from '@/modules/charges-rate-scheme'
import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'

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
