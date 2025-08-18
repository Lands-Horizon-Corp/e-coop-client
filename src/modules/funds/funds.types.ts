import z from 'zod'

import { IAccount } from '../account'
import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '../common'

export interface IFundsRequest {
    account_id?: TEntityId | null
    type: string
    description?: string
    icon?: string | null
    gl_books?: string
}

export interface IFundsResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    account_id?: TEntityId | null
    account?: IAccount
    type: string
    description: string
    icon?: string | null
    gl_books: string
}

export const fundsRequestSchema = z.object({
    account_id: entityIdSchema.nullable().optional(),
    type: z.string().min(1).max(255),
    description: z.string().optional(),
    icon: z.string().nullable().optional(),
    gl_books: z.string().optional(),
})
