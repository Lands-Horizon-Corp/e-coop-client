import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberGender } from './member-gender'
import { IMemberProfile } from './member-profile'

export interface IMemberGenderHistory extends ITimeStamps {
    id: TEntityId
    memberProfileId: TEntityId
    memberGenderId: TEntityId
    memberProfile?: IMemberProfile
    memberGender?: IMemberGender
}

export interface IMemberGenderHistoryPaginated
    extends IPaginatedResult<IMemberGenderHistory> {}
