import { TUserType } from '../auth/user'
import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from '../coop-types'

// Invitation Code Resource
export interface IInvitationCode extends ITimeStamps, IAuditable {
    id: TEntityId

    user_type: TUserType
    code: string

    expiration_date: string
    max_use: number
    current_use: number

    description: string
}

export interface IInvitationCodeRequest {
    id?: TEntityId

    user_type: TUserType
    code: string

    expiration_date: string
    max_use: number
    current_use: number

    description: string
}

export interface IInvitationCodePaginated
    extends IPaginatedResult<IInvitationCode> {}
