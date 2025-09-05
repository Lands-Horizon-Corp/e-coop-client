import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IBank } from '../bank/bank.types'
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
