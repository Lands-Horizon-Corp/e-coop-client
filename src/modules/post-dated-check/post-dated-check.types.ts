import z from 'zod'

import { IBank } from '../bank/bank.types'
import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '../common'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { IUser } from '../user/user.types'

export interface IPostDatedCheckRequest {
    member_profile_id?: TEntityId
    full_name?: string
    passbook_number?: string
    check_number?: string
    check_date?: string
    clear_days?: number
    date_cleared?: string
    bank_id?: TEntityId
    amount?: number
    reference_number?: string
    official_receipt_date?: string
    collateral_user_id?: TEntityId
    description?: string
}

export interface IPostDatedCheckResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id?: TEntityId
    member_profile?: IMemberProfile
    full_name: string
    passbook_number: string
    check_number: string
    check_date: string
    clear_days: number
    date_cleared: string
    bank_id: TEntityId
    bank?: IBank
    amount: number
    reference_number: string
    official_receipt_date: string
    collateral_user_id: TEntityId
    collateral_user?: IUser
    description: string
}

export const postDatedCheckRequestSchema = z.object({
    member_profile_id: entityIdSchema.optional(),
    full_name: z.string().optional(),
    passbook_number: z.string().optional(),
    check_number: z.string().optional(),
    check_date: z.string().datetime().optional(),
    clear_days: z.number().optional(),
    date_cleared: z.string().datetime().optional(),
    bank_id: entityIdSchema.optional(),
    amount: z.number().optional(),
    reference_number: z.string().optional(),
    official_receipt_date: z.string().datetime().optional(),
    collateral_user_id: entityIdSchema.optional(),
    description: z.string().optional(),
})
