import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { IMemberDepartment } from '../member-department/member-department.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberDepartmentHistoryRequest {
    member_department_id: TEntityId
    member_profile_id: TEntityId
    branch_id: TEntityId
    organization_id: TEntityId
}

export interface IMemberDepartmentHistoryResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_department_id: TEntityId
    member_department?: IMemberDepartment
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
}

export const memberDepartmentHistoryRequestSchema = z.object({
    member_department_id: entityIdSchema,
    member_profile_id: entityIdSchema,
    branch_id: entityIdSchema,
    organization_id: entityIdSchema,
})
