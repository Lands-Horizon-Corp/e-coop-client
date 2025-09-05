import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { MemberDepartmentSchema } from './member-department.validation'

export interface IMemberDepartment extends IBaseEntityMeta {
    id: TEntityId
    name: string
    description?: string
    icon?: string
}

export type IMemberDepartmentRequest = z.infer<typeof MemberDepartmentSchema>

export interface IMemberDepartmentPaginated
    extends IPaginatedResult<IMemberDepartment> {}
