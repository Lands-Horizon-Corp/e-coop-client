import { ICompanyResource } from './company'
import { IFootstepResource } from './footstep'
import { IUserBase, TAccountType } from './common'
import { IPaginatedResult } from './paginated-result'
import { IMediaRequest, IMediaResource } from './media'

export interface IOwnerResource extends IUserBase {
    accountType: 'Owner'
    media?: IMediaResource
    companies?: ICompanyResource[]
    footsteps?: IFootstepResource[]
}

export interface IOwnerRequest {
    accountType: TAccountType
    username: string
    firstName: string
    lastName: string
    middleName?: string
    email: string
    password: string
    confirmPassword: string
    birthDate: string
    contactNumber: string
    permanentAddress: string
    media?: IMediaRequest

    emailTemplate?: string
    contactTemplate?: string
}

export interface IOwnerPaginatedResource
    extends IPaginatedResult<IOwnerResource> {}
