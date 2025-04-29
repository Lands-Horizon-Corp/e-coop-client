import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

export interface IMemberIncomeRequest {
    id?: TEntityId
    name: string
    amount: number
    date: string
    description: string
}

export interface IMemberIncome extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    name: string
    amount: number
    date: string
    description: string
    membersProfile?: IMemberProfile
}
