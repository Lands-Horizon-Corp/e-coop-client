import { TPermission } from '@/constants/permission'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

export interface IPermissionTemplate extends IBaseEntityMeta {
    name: string
    description: string
    permissions: TPermission[]
}
export interface IPermissionTemplateRequest {
    id?: TEntityId

    organization_id?: TEntityId
    branch_id?: TEntityId

    name: string
    description: string
    permissions: TPermission[]
}

export interface IPermissionTemplatePaginated
    extends IPaginatedResult<IPermissionTemplate> {}
