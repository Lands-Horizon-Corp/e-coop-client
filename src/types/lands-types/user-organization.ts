import { IBranch } from '../coop-types'
import { IUserBase } from '../auth/user'
import { IOrganization } from './organization'
import { TEntityId, IBaseEntityMeta, TUserType } from '../common'
import { IPaginatedResponse } from '@/components/data-table/data-table-pagination/type'

export interface IUserOrganization<TUser = IUserBase> extends IBaseEntityMeta {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    description?: string

    user_id: TEntityId
    user: TUser

    user_type: TUserType

    application_description?: string
    application_status: 'pending' | 'reported' | 'accepted' | 'ban'
}

export interface IUserOrganizationResponse {
    organization: IOrganization
    user_organization: IUserOrganization
}

export interface IUserOrganizationPaginated<TUser = IUserBase>
    extends IPaginatedResponse<IUserOrganization<TUser>> {}
