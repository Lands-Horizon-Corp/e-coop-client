import { IUserBase } from '../auth'
/**
 * {DataTypeHere} - Note: used for usual data type declaration.
 * {(OneDataType|AnotherDataType)} - Note: used for cases where data type could be either of the two.
 * {DataType[]} - Note: used for an array of DataType instances.
 * {?DataTypeHere} - Note: used for data types which could be the data type mentioned or null.
 * {DataTypeHere} [parameterNameHere] - Note: used for optional parameters.
 * {Object.<KeyDataType, ValueDataType>} - Note: used for an object with KeyDataType keys and ValueDataType values
 */
import { IPaginatedResult } from './paginated-result'
import { ITimeStamps, TEntityId, IAuditable, TUserType } from '../common'

export interface IFootstep extends ITimeStamps, IAuditable {
    id: TEntityId
    branch_id: TEntityId | null

    user_type: TUserType
    user_id: TEntityId
    user: IUserBase

    module: string
    description: string | null
    activity: string

    latitude: number | null
    longitude: number | null
    ip_address: string | null
    user_agent: string | null
    referer: string | null
    location: string | null
    accept_language: string | null
}

export interface IFootstepPaginated extends IPaginatedResult<IFootstep> {}
