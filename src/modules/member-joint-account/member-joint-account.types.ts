import z from 'zod'

import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IBranch } from '../branch'
import { IMedia } from '../media/media.types'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { TRelationship } from '../member-relative-account'
import { IOrganization } from '../organization'
import { MemberJointAccountSchema } from './member-joint-account.validation'

// LATEST FROM ERD
export interface IMemberJointAccount extends IBaseEntityMeta {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    picture_media_id: TEntityId
    picture_media: IMedia

    signature_media_id: TEntityId
    signature_media: IMedia

    description?: string

    first_name: string
    middle_name?: string
    last_name: string
    full_name: string
    suffix?: string

    birthday: string
    family_relationship: TRelationship
}

// LATEST FROM ERD
export type IMemberJointAccountRequest = z.infer<
    typeof MemberJointAccountSchema
> & { full_name: string }
