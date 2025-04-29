import { ITimeStamps, TEntityId } from '../common'
import { IMemberProfileResource } from './member-profile'

export interface IMemberIncomeRequest {
    id?: TEntityId
    name: string
    amount: number
    date: string
    description: string
}

export interface IMemberIncomeResource extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    name: string
    amount: number
    date: string
    description: string
    membersProfile?: IMemberProfileResource
}
