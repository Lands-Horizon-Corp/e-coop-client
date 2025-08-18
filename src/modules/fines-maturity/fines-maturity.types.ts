import z from 'zod'

import { IAccount } from '../account'
import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '../common'

export interface IFinesMaturityRequest {
    account_id?: TEntityId
    from: number
    to: number
    rate: number
}

export interface IFinesMaturityResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    account_id?: TEntityId
    account?: IAccount // Assuming IAccount is defined in common or another module
    from: number
    to: number
    rate: number
}

export const finesMaturityRequestSchema = z.object({
    account_id: entityIdSchema.optional().nullable(),
    from: z.number(),
    to: z.number(),
    rate: z.number(),
})
