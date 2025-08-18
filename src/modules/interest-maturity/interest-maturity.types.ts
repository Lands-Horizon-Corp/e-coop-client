import z from 'zod'

import { IAccount } from '../account'
import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '../common'

export interface IInterestMaturityRequest {
    account_id?: TEntityId | null
    from: number
    to: number
    rate: number
}

export interface IInterestMaturityResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    account_id?: TEntityId | null
    account?: IAccount
    from: number
    to: number
    rate: number
}

export const interestMaturityRequestSchema = z.object({
    account_id: entityIdSchema.nullable().optional(),
    from: z.number(),
    to: z.number(),
    rate: z.number(),
})
