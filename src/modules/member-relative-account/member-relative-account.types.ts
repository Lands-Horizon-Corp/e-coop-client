import z from 'zod'

import { IBaseEntityMeta, TEntityId, TRelationship } from '@/types/common'

import { IBranch } from '../branch'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { IOrganization } from '../organization'
import { MemberRelativeAccountSchema } from './member-relative-account.validation'

// FROM LATEST ERD
export type IMemberRelativeAccountRequest = z.infer<
    typeof MemberRelativeAccountSchema
>

// FROM LATEST ERD
export interface IMemberRelativeAccount extends IBaseEntityMeta {
    id: TEntityId

    organization_id: TEntityId
    organization: IOrganization

    branch_id: TEntityId
    branch: IBranch

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    relative_member_profile_id: TEntityId
    relative_member_profile: IMemberProfile

    family_relationship: TRelationship
    description: string
}
