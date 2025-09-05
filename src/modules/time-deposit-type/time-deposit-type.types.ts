import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { ITimeDepositComputationResponse } from '../time-deposit-computation'

export interface ITimeDepositTypeRequest {
    name: string
    description?: string
    pre_mature?: number
    pre_mature_rate?: number
    excess?: number
    header_1?: number
    header_2?: number
    header_3?: number
    header_4?: number
    header_5?: number
    header_6?: number
    header_7?: number
    header_8?: number
    header_9?: number
    header_10?: number
    header_11?: number
}

export interface ITimeDepositTypeResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    name: string
    description: string
    pre_mature: number
    pre_mature_rate: number
    excess: number
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
    time_deposit_computations?: ITimeDepositComputationResponse[]
    time_deposit_computation_pre_matures?: ITimeDepositComputationResponse[]
}
