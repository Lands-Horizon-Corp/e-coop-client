import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IBranch } from '../branch'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { EDUCATIONAL_ATTAINMENT } from './constants'

export type TEducationalAttainment = (typeof EDUCATIONAL_ATTAINMENT)[number] // move to member educ attainment

// FROM LATEST ERD
export interface IMemberEducationalAttainmentRequest {
    id?: TEntityId

    branch_id?: TEntityId
    member_profile_id: TEntityId

    school_name?: string
    school_year?: number
    program_course?: string
    educational_attainment: TEducationalAttainment
    description?: string
}

// FROM LATEST ERD
export interface IMemberEducationalAttainment extends ITimeStamps, IAuditable {
    id: TEntityId

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    school_name?: string
    school_year?: number
    program_course?: string
    educational_attainment: TEducationalAttainment
    description?: string

    // history?: IMemberEducationalAttainmentHistory[]
}

export interface IMemberEducationalAttainmentPaginated
    extends IPaginatedResult<IMemberEducationalAttainment> {}
