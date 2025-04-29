import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

export interface IMemberExpensesRequest {
    id?: TEntityId
    name: string
    date: string
    amount: number
    description: string
}

export interface IMemberExpenses extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    name: string
    date: string
    amount: number
    description: string
    membersProfile?: IMemberProfile
}
