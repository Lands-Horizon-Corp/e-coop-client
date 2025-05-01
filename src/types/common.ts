import { AccountClosureReasons, FAMILY_RELATIONSHIP } from '@/constants'
import { IUserBase } from './auth/user'

export type TEntityId = string

export type TAccountType = 'Member' | 'Employee' | 'Admin' | 'Owner'

export type TAccountStatus = 'Pending' | 'Verified' | 'Not Allowed'

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
