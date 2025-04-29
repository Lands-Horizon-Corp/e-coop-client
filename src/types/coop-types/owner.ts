import { ICompanyResource } from './company'
import { IFootstep } from './footstep'
import { IUserBase, TAccountType } from '../common'
import { IPaginatedResult } from './paginated-result'
import { IMediaRequest, IMedia } from './media'

// TODO: To remove
export interface IOwner extends IUserBase {
    accountType: 'Owner'
    media?: IMedia
    companies?: ICompanyResource[]
    footsteps?: IFootstep[]
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

export interface IOwnerPaginatedResource extends IPaginatedResult<IOwner> {}
