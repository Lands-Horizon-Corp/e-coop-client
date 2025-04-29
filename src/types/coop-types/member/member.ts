import { IMediaRequest } from '../media'
import { IRoles } from '../role'
import { IGender } from '../gender'
import { IFootstep } from '../footstep'
import { IPaginatedResult } from '../paginated-result'
import { IMemberProfile } from './member-profile'
import { IUserBase, TAccountStatus, TEntityId } from '../../common'

export interface IMemberRequest {
    username: string
    firstName: string
    lastName: string
    middleName?: string
    birthDate: Date

    contactNumber: string
    permanentAddress: string

    email: string
    password: string
    confirmPassword: string
    media?: IMediaRequest

    emailTemplate?: string
    contactTemplate?: string

    companyId?: TEntityId
}

export interface IMemberRequestNoPassword
    extends Omit<IMemberRequest, 'password' | 'confirmPassword'> {
    password?: string
    confirmPassword?: string
}

// TODO
export interface IMember extends IUserBase {
    id: TEntityId
    accountType: 'Member'

    username: string
    fullName: string
    isEmailVerified: boolean
    isContactVerified: boolean
    isSkipVerification: boolean

    role?: IRoles
    gender?: IGender

    status: TAccountStatus

    footsteps?: IFootstep[]
    memberProfile?: IMemberProfile
}

export interface IMemberPaginatedResource extends IPaginatedResult<IMember> {}
