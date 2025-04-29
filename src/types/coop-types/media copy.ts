import { IAdminResource } from './admin'
import { IOwnerResource } from './owner'
import { IEmployeeResource } from './employee'
import { IMemberResource } from './member/member'
import { ITimeStamps, TEntityId } from './common'

export interface IMediaResource extends ITimeStamps {
    id: TEntityId
    fileName: string
    fileSize: number
    fileType: string
    storageKey: string
    url: string
    bucketName: string
    downloadURL: string

    memberId?: TEntityId
    member?: IMemberResource

    employeeId?: TEntityId
    employee?: IEmployeeResource

    ownerId?: TEntityId
    owner?: IOwnerResource

    adminId?: TEntityId
    admin?: IAdminResource
}

export interface IMediaRequest {
    id?: TEntityId
    fileName: string
    fileSize: number
    fileType: string
    storageKey: string
    key?: string
    url?: string
    bucketName?: string

    memberId?: TEntityId
    member?: IMemberResource

    employeeId?: TEntityId
    employee?: IEmployeeResource

    ownerId?: TEntityId
    owner?: IOwnerResource

    adminId?: TEntityId
    admin?: IAdminResource
}
