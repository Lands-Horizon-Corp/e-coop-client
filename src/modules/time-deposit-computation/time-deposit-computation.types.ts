import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { ITimeDepositTypeResponse } from '../time-deposit-type'

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

export interface ITimeDepositComputationResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    time_deposit_type_id: TEntityId
    time_deposit_type?: ITimeDepositTypeResponse
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

export const timeDepositComputationRequestSchema = z.object({
    minimum_amount: z.number().optional(),
    maximum_amount: z.number().optional(),
    header1: z.number().optional(),
    header2: z.number().optional(),
    header3: z.number().optional(),
    header4: z.number().optional(),
    header5: z.number().optional(),
    header6: z.number().optional(),
    header7: z.number().optional(),
    header8: z.number().optional(),
    header9: z.number().optional(),
    header10: z.number().optional(),
    header11: z.number().optional(),
})
