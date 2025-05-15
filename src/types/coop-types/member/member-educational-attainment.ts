import { IBranch } from '../branch'
import { IMemberProfile } from './member-profile'
import { IPaginatedResult } from '../paginated-result'
import {
    IAuditable,
    ITimeStamps,
    TEducationalAttainment,
    TEntityId,
} from '../../common'

// THIS IS NOT A MAINTENANCE
// FROM LATEST ERD
export interface IMemberEducationalAttainmentRequest {
    id?: TEntityId

    branch_id?: TEntityId
    member_profile_id: TEntityId

    name: string
    school_name?: string
    school_year?: number
    program_course?: string
    educational_attainment: TEducationalAttainment
    description?: string
}

// THIS IS NOT A MAINTENANCE
// FROM LATEST ERD
export interface IMemberEducationalAttainment extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    name: string
    school_name?: string
    school_year?: number
    program_course?: string
    educational_attainment: TEducationalAttainment
    description?: string

    // history?: IMemberEducationalAttainmentHistory[]
}

export interface IMemberEducationalAttainmentPaginated
    extends IPaginatedResult<IMemberEducationalAttainment> {}
