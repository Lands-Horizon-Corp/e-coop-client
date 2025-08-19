import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

export interface IMemberDepartment extends IBaseEntityMeta {
    id: TEntityId
    name: string
    description?: string
    icon?: string
}

export interface IMemberDepartmentRequest {
    id?: TEntityId
    name: string
    description?: string
    icon?: string
}

export interface IMemberDepartmentPaginated
    extends IPaginatedResult<IMemberDepartment> {}
