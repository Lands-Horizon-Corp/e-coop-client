import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    descriptionSchema,
} from '../common'

export interface ICollateralRequest {
    icon?: string
    name: string
    description?: string
}

export interface ICollateralResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    icon: string
    name: string
    description: string
}

export const collateralRequestSchema = z.object({
    icon: z.string().optional(),
    name: z.string().min(1).max(255),
    description: descriptionSchema.optional(),
})
