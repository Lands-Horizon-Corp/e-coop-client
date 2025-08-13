import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IPaginatedResult } from '../paginated-result'
import { IMemberDepartment } from './member-department'
import { IMemberProfile } from './member-profile'

export interface IMemberDepartmentHistory extends IBaseEntityMeta {
    member_profile_id: TEntityId
    member_profile: IMemberProfile
    member_department_id: TEntityId
    member_department: IMemberDepartment
}

export interface IMemberDepartmentHistoryPaginated
    extends IPaginatedResult<IMemberDepartmentHistory> {}
