import { IBranch } from "../branch"
import { ITimeStamps, IAuditable, TEntityId, IPaginatedResult } from "../common"
import { IMemberCenter } from "../member-center/member-center.types"
import { IMemberProfile } from "../member-profile/member-profile.types"

export interface IMemberCenterHistory extends ITimeStamps, IAuditable {
    id: TEntityId

    member_center_id: TEntityId
    member_center: IMemberCenter

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    branch_id: TEntityId
    branch: IBranch
}

export interface IMemberCenterHistoryPaginated
    extends IPaginatedResult<IMemberCenterHistory> {}