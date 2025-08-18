import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '../common'
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

export const timeDepositTypeRequestSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    pre_mature: z.number().optional(),
    pre_mature_rate: z.number().optional(),
    excess: z.number().optional(),
    header_1: z.number().optional(),
    header_2: z.number().optional(),
    header_3: z.number().optional(),
    header_4: z.number().optional(),
    header_5: z.number().optional(),
    header_6: z.number().optional(),
    header_7: z.number().optional(),
    header_8: z.number().optional(),
    header_9: z.number().optional(),
    header_10: z.number().optional(),
    header_11: z.number().optional(),
})
