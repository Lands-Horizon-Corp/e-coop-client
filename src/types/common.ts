import { IBranch } from './coop-types'
import { IUserBase } from './auth/user'
import { IOrganization } from './lands-types'
import {
    CIVIL_STATUS,
    GENERAL_STATUS,
    FAMILY_RELATIONSHIP,
    AccountClosureReasons,
    EDUCATIONAL_ATTAINMENT,
    USER_TYPE,
} from '@/constants'

export type TEntityId = string

export type TUserType = (typeof USER_TYPE)[number]

export type TGeneralStatus = (typeof GENERAL_STATUS)[number]

export type TRelationship = (typeof FAMILY_RELATIONSHIP)[number]

export interface ILongLat {
    longitude?: number // `float64` maps to `number` in TypeScript
    latitude?: number // `float64` maps to `number` in TypeScript
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
    branch: IBranch
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

export type TCivilStatus = (typeof CIVIL_STATUS)[number]

export type TAccountClosureReasonType = (typeof AccountClosureReasons)[number]

export type TEducationalAttainment = (typeof EDUCATIONAL_ATTAINMENT)[number]
