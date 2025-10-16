import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { ITimeDepositType } from '../time-deposit-type'

export interface ITimeDepositComputationRequest {
    minimum_amount?: number
    maximum_amount?: number
    header1?: number
    header2?: number
    header3?: number
    header4?: number
    header5?: number
    header6?: number
    header7?: number
    header8?: number
    header9?: number
    header10?: number
    header11?: number
}

export interface ITimeDepositComputation
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    time_deposit_type_id: TEntityId
    time_deposit_type?: ITimeDepositType
    minimum_amount: number
    maximum_amount: number
    header_1: number
    header_2: number
    header_3: number
    header_4: number
    header_5: number
    header_6: number
    header_7: number
    header_8: number
    header_9: number
    header_10: number
    header_11: number
}
