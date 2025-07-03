import { ITimeStamps, TEntityId } from '../../common'
import { IMemberProfile } from './member-profile'

// NOT IN LATEST ERD
export interface IMemberWallet extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    debit: number
    credit: number
    date: string
    description: string
    membersProfile?: IMemberProfile
}
