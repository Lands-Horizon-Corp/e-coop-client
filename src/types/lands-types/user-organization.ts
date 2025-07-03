import { IUserBase } from '../auth/user'
import { IOrganization } from './organization'
import { TPermission } from '../coop-types/permission'
import { IBranch, IPaginatedResult } from '../coop-types'
import { TEntityId, IBaseEntityMeta, TUserType } from '../common'

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

    // Perms
    permission_name: string
    permission_description: string
    permissions: TPermission[]
}

export interface IUserOrganizationResponse {
    organization: IOrganization
    user_organization: IUserOrganization
}

export interface UserOrganizationGroup {
    orgnizationId: TEntityId
    userOrganizationId: TEntityId
    organizationDetails: IOrganization
    branches: IBranch[]
    userOrganization: IUserOrganization
    isPending: 'pending' | 'reported' | 'accepted' | 'ban'
}

export interface IOrgUserOrganizationGroup extends IOrganization {
    user_organizations: IUserOrganization[]
}

export interface IUserOrganizationPaginated<TUser = IUserBase>
    extends IPaginatedResult<IUserOrganization<TUser>> {}
