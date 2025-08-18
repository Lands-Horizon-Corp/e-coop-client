import z from 'zod'

import { IBranch } from '../branch'
import {
    IAuditable,
    ITimeStamps,
    TEntityId,
    TRelationship,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { IOrganization } from '../organization'

// FROM LATEST ERD
export interface IMemberRelativeAccountRequest {
    id?: TEntityId

    branch_id?: TEntityId
    organization_id?: TEntityId

    member_profile_id: TEntityId
    relative_member_profile_id: TEntityId

    family_relationship: TRelationship
    description?: string
}

// FROM LATEST ERD
export interface IMemberRelativeAccount extends ITimeStamps, IAuditable {
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

export const memberRelativeAccountsSchema = z.object({
    membersProfileId: entityIdSchema.optional(),
    relativeProfileMemberId: entityIdSchema,
    familyRelationship: z.string().min(1, 'Family relationship is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})
