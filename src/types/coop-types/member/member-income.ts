import { ITimeStamps, TEntityId } from '../../common'
import { IBranch } from '../branch'
import { IMedia } from '../media'
import { IMemberProfile } from './member-profile'

// LATEST FROM ERD
export interface IMemberIncomeRequest {
    id?: TEntityId

    member_profile_id: TEntityId
    media_id?: TEntityId
    branch_id?: TEntityId

    name: string
    amount: number
    release_date: string
}

// LATEST FROM ERD
export interface IMemberIncome extends ITimeStamps {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    media_id?: TEntityId
    media?: IMedia

    branch_id?: TEntityId
    branch?: IBranch

    name: string
    amount: number
    release_date: string
}
