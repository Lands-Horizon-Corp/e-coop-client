import { ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../paginated-result'
import { IMemberGenderResource } from './member-gender'
import { IMemberProfileResource } from './member-profile'

export interface IMemberGenderHistoryResource extends ITimeStamps {
    id: TEntityId
    memberProfileId: TEntityId
    memberGenderId: TEntityId
    memberProfile?: IMemberProfileResource
    memberGender?: IMemberGenderResource
}

export interface IMemberGenderHistoryPaginatedResource
    extends IPaginatedResult<IMemberGenderHistoryResource> {}
