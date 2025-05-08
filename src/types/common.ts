import { AccountClosureReasons, FAMILY_RELATIONSHIP } from '@/constants'
import { IUserBase } from './auth/user'
import { IBranch } from './coop-types'
import { IOrganization } from './lands-types'

export type TEntityId = string

export type TGeneralStatus =
    | 'pending'
    | 'for review'
    | 'verified'
    | 'not allowed'

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
        IOrgBranchIdentity {}

export interface ITimeStamps {
    deleted_at?: string | null
    created_at: string
    updated_at?: string
}

export type TCivilStatus =
    | 'Married'
    | 'Single'
    | 'Widowed'
    | 'Separated'
    | 'N/A'

export type TAccountClosureReasonType = (typeof AccountClosureReasons)[number]
