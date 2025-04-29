import { IMediaRequest } from '../media'
import { IRolesResource } from '../role'
import { IGenderResource } from '../gender'
import { IFootstepResource } from '../footstep'
import { IPaginatedResult } from '../paginated-result'
import { IMemberProfileResource } from './member-profile'
import { IUserBase, TAccountStatus, TEntityId } from '../common'

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

export interface IMemberResource extends IUserBase {
    id: TEntityId
    accountType: 'Member'

    username: string
    fullName: string
    isEmailVerified: boolean
    isContactVerified: boolean
    isSkipVerification: boolean

    role?: IRolesResource
    gender?: IGenderResource

    status: TAccountStatus

    footsteps?: IFootstepResource[]
    memberProfile?: IMemberProfileResource
}

export interface IMemberPaginatedResource
    extends IPaginatedResult<IMemberResource> {}
