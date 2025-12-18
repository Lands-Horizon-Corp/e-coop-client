import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IMedia } from '../media/media.types'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { TMemberGovernmentBenefitSchema } from './member-government-benefit.validation'

// LATEST FROM ERD
export type IMemberGovernmentBenefitRequest = TMemberGovernmentBenefitSchema

// LATEST FROM ERD
export interface IMemberGovernmentBenefit extends IBaseEntityMeta {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    front_media_id: TEntityId
    front_media: IMedia

    back_media_id: TEntityId
    back_media: IMedia

    name: string
    country_code: string
    value?: string
    expiry_date?: string
    description: string
}

export interface IGovernmentId {
    name: string
    has_expiry_date: boolean

    field_name: string
    has_number: boolean

    regex: string
}
