import { ITimeStamps, TEntityId } from '../common'
import { IMemberProfileResource } from './member-profile'

export interface IMemberExpensesRequest {
    id?: TEntityId
    name: string
    date: string
    amount: number
    description: string
}

export interface IMemberExpensesResource extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    name: string
    date: string
    amount: number
    description: string
    membersProfile?: IMemberProfileResource
}
