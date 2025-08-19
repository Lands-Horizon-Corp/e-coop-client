import { ITimeStamps, TEntityId } from '@/types/common'

import { IBranch } from '../branch'
import { IMedia } from '../media/media.types'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { IOrganization } from '../organization'

// LATEST FROM ERD
export interface IMemberGovernmentBenefitRequest {
    id?: TEntityId
    member_profile_id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    front_media_id?: TEntityId
    back_media_id?: TEntityId

    name: string
    country_code: string
    value: string
    expiry_date?: string
    description?: string
}

// LATEST FROM ERD
export interface IMemberGovernmentBenefit extends ITimeStamps {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    organization_id: TEntityId
    organizaiton: IOrganization
    branch_id: TEntityId
    branch: IBranch

    front_media_id: TEntityId
    front_media: IMedia

    back_media_id: TEntityId
    back_media: IMedia

    name: string
    country_code: string
    value: string
    expiry_date?: string
    description: string
}
