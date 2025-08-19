import z from 'zod'

import {
    IAuditable,
    ITimeStamps,
    TEntityId,
    TRelationship,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
    mediaSchema,
} from '@/types/common'

import { IBranch } from '../branch'
import { IMedia } from '../media/media.types'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { IOrganization } from '../organization'

// LATEST FROM ERD
export interface IMemberJointAccountRequest {
    id?: TEntityId

    member_profile_id: TEntityId

    picture_media_id: TEntityId
    signature_media_id: TEntityId

    branch_id?: TEntityId
    organization_id?: TEntityId

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
export interface IMemberJointAccount extends ITimeStamps, IAuditable {
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

export const memberJointAccountsSchema = z.object({
    id: entityIdSchema.optional(),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    suffix: z.string().optional(),

    middleName: z.string().optional(),
    familyRelationship: z.string().optional(),

    // new properties
    mediaId: entityIdSchema.optional(),
    media: mediaSchema.optional(),
    signatureMediaId: entityIdSchema.optional(),
    signatureMedia: mediaSchema.optional(),
})
