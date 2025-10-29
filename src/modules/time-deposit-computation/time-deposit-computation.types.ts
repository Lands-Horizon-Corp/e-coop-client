import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { ITimeDepositType } from '../time-deposit-type'
import { TTimeDepositComputationSchema } from './time-deposit-computation.validation'

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

export type ITimeDepositComputationRequest = TTimeDepositComputationSchema
