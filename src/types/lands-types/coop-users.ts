import { IPaginatedResult } from '../coop-types'
import { ITimeStamps, TEntityId } from '../common'

/*
 * ICoopUser defines the cooperative (coop) affiliation of a user.
 * The 'coop_db_name' property is used to determine the specific database
 * associated with the user's cooperative, eliminating the need for additional
 * coop, coop branch, or user type input during sign-in.
 */

export interface ICoopUser extends ITimeStamps {
    id: TEntityId
    email: string
    user_name: string
    contact_number: string
    coop_db_name: string
}

export interface ICoopUser extends IPaginatedResult<ICoopUser> {}
