import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IBank } from '../bank/bank.types'
import { IMedia } from '../media/media.types'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { IUserBase } from '../user/user.types'
import { CheckWarehousingSchema } from './check-warehousing.validation'

export interface ICheckWarehousing extends IBaseEntityMeta {
    is_today: boolean
    is_past: boolean
    is_future: boolean

    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    bank_id: TEntityId
    bank?: IBank
    employee_user_id: TEntityId
    employee_user?: IUserBase
    media_id?: TEntityId
    media?: IMedia

    check_number: string
    check_date: Date
    clear_days: number
    date_cleared: Date
    amount: number
    reference_number: string
    date: Date
    description: string
}
export type ICheckWarehousingRequest = z.infer<typeof CheckWarehousingSchema>

export interface ICheckWarehousingPaginated extends IPaginatedResult<ICheckWarehousing> {}

export interface ICheckWarehousingSummary {
    total_amount: number
    total_cleared_amount: number
    total_checks_count: number
    total_checks_cleared_count: number
}
