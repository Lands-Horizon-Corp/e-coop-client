import {
    AccountClosureReasons,
    CIVIL_STATUS,
    FAMILY_RELATIONSHIP,
    GENERAL_STATUS,
    USER_TYPE,
} from '@/constants'
import { IBranch } from '@/modules/branch'
import { TAG_CATEGORY } from '@/modules/tag-template/tag.constants'

import { IOrganization } from '../modules/organization'
import { IUserBase } from '../modules/user/user.types'

export type TEntityId = string

export type TUserType = (typeof USER_TYPE)[number] // move User module

export type TGeneralStatus = (typeof GENERAL_STATUS)[number]

export type TRelationship = (typeof FAMILY_RELATIONSHIP)[number] // move to member profile relative

export type TTagCategory = (typeof TAG_CATEGORY)[number]

export type TPageType = 'PUBLIC' | 'AUTHENTICATED'

export interface ILongLat {
    longitude?: number
    latitude?: number
}

/* Extend interface if gusto magka ts type neto */
export interface IAuditable {
    created_by_id?: TEntityId
    created_by?: IUserBase

    updated_by_id?: TEntityId
    updated_by?: IUserBase

    deleted_by_id?: TEntityId
    deleted_by?: IUserBase
}

/* Only use this for entity that has branch_id */
export interface IIDentity {
    branch_id: TEntityId
    // branch: IBranch
}

export interface IOrgIdentity {
    organization_id: TEntityId
    organization: IOrganization
}

/* Identity of the entity */
export interface IOrgBranchIdentity {
    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch
}

/* Use this only if entity has timestamps, auditable, and has org and branch */
export interface IBaseEntityMeta
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
}

export interface ITimeStamps {
    deleted_at?: string | undefined
    created_at: string
    updated_at?: string
}

export type TCivilStatus = (typeof CIVIL_STATUS)[number] // move to member profile

export type TAccountClosureReasonType = (typeof AccountClosureReasons)[number] // member profile

export interface UpdateIndexRequest {
    id: TEntityId
    index: number
}

export interface IPaginatedResult<T> {
    data: T[]
    pageIndex: number
    totalPage: number
    pageSize: number
    totalSize: number
}
