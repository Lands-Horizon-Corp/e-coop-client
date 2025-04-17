import { TEntityId } from './common'
import { IMediaResource } from './media'
import { IOwnerResource } from './owner'
import { IBranchResource } from './branch'
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

export interface ICompanyResource {
    id: TEntityId
    name: string
    description?: string
    address?: string
    longitude?: number
    latitude?: number
    contactNumber: string
    isAdminVerified: boolean
    owner?: IOwnerResource
    media?: IMediaResource
    branches?: IBranchResource[]
    createdAt: string
    updatedAt: string
}

export interface ICompanyPaginatedResource
    extends IPaginatedResult<ICompanyResource> {}
