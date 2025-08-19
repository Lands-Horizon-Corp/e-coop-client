import z from 'zod'

import {
    IAuditable,
    ITimeStamps,
    TEntityId,
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/types/common'

import { IMemberProfile } from '../member-profile/member-profile.types'

// LATEST FROM ERD
export interface IMemberContactReferenceRequest {
    id?: TEntityId

    name: string
    description: string
    contact_number: string
}

// LATEST FROM ERD
export interface IMemberContactReference extends ITimeStamps, IAuditable {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    name: string
    description: string
    contact_number: string
}

export const memberContactReferenceSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    contactNumber: z.string().min(1, 'Contact Number is required'),
})
