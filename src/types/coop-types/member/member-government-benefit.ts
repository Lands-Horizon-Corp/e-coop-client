import { IMedia } from '../media'
import { IMemberProfile } from './member-profile'
import { ITimeStamps, TEntityId } from '../../common'

// LATEST FROM ERD
export interface IMemberGovernmentBenefitRequest {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    front_media_id: TEntityId
    front_media: IMedia

    back_media_id: TEntityId
    back_media: IMedia

    name: string
    country_code: string
    value: string
    description: string
}

// LATEST FROM ERD
export interface IMemberGovernmentBenefit extends ITimeStamps {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    front_media_id: TEntityId
    front_media: IMedia

    back_media_id: TEntityId
    back_media: IMedia

    name: string
    country_code: string
    value: string
    description: string
}
