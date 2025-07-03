import { IAuditable, ITimeStamps, TEntityId, TUserType } from '../common'
import { IBranch, IPaginatedResult } from '../coop-types'
import { IOrganization } from './organization'

// Invitation Code Resource
export interface IInvitationCode extends ITimeStamps, IAuditable {
    id: TEntityId

    user_type: TUserType
    code: string

    expiration_date?: string
    max_use: number
    current_use: number

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

    description: string
}

export interface IInvitationCodePaginated
    extends IPaginatedResult<IInvitationCode> {}
