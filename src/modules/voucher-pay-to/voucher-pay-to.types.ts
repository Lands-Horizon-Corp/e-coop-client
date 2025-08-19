import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { IMedia } from '../media/media.types'

export interface IVoucherPayToRequest {
    name?: string
    media_id?: TEntityId
    description?: string
}

export interface IVoucherPayToResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    name: string
    media_id?: TEntityId
    media?: IMedia
    description: string
}

export const voucherPayToRequestSchema = z.object({
    name: z.string().optional(),
    media_id: entityIdSchema.optional(),
    description: z.string().optional(),
})
