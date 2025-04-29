import { TEntityId } from '../common'
import { IMedia } from './media'
import { IOwner } from './owner'
import { IBranch } from './branch'
import { IPaginatedResult } from './paginated-result'

export interface ICompanyRequest {
    name: string
    description?: string
    address?: string
    longitude?: number
    latitude?: number
    email?: string
    contactNumber: string
    ownerId?: TEntityId
    companyId?: TEntityId
    mediaId?: TEntityId
    isAdminVerified?: boolean
}

// TODO: This will be the ICoop
export interface ICompanyResource {
    id: TEntityId
    name: string
    description?: string
    address?: string
    longitude?: number
    latitude?: number
    contactNumber: string
    isAdminVerified: boolean
    owner?: IOwner
    media?: IMedia
    branches?: IBranch[]
    createdAt: string
    updatedAt: string
}

export interface ICompanyPaginatedResource
    extends IPaginatedResult<ICompanyResource> {}
