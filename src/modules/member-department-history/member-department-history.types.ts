import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { IMemberDepartment } from '../member-department/member-department.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberDepartmentHistoryRequest {
    member_department_id: TEntityId
    member_profile_id: TEntityId
    branch_id: TEntityId
    organization_id: TEntityId
}

export interface IMemberDepartmentHistory extends IBaseEntityMeta {
    id: TEntityId
    member_department_id: TEntityId
    member_department?: IMemberDepartment
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
}

export interface IMemberDepartmentHistoryPaginated
    extends IPaginatedResult<IMemberDepartmentHistory> {}
