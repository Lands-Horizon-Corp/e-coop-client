import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
    TUserType,
} from '@/types/common'

import { IBranch } from '../branch/branch.types'
import { IOrganization } from '../organization'
import { TPermission } from '../permission'

// Invitation Code Resource
export interface IInvitationCode extends ITimeStamps, IAuditable {
    id: TEntityId

    user_type: TUserType
    code: string

    expiration_date?: string
    max_use: number
    current_use: number

    permission_name: string
    permission_description: string
    permissions: TPermission[]

    description: string
    branch: IBranch
    organization: IOrganization
}

export interface IInvitationCodeRequest {
    id?: TEntityId

    user_type: TUserType
    code: string

    expiration_date?: string
    max_use: number
    current_use?: number

    permission_name: string
    permission_description: string
    permissions: TPermission[]

    description: string
}

export interface IInvitationCodePaginated
    extends IPaginatedResult<IInvitationCode> {}
