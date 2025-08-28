import z from 'zod'

import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IMemberProfile } from '../member-profile/member-profile.types'
import { MemberContactReferenceSchema } from './member-contact-reference.validation'

// LATEST FROM ERD
export interface IMemberContactReference extends IBaseEntityMeta {
    id: TEntityId

    member_profile_id: TEntityId
    member_profile: IMemberProfile

    name: string
    description: string
    contact_number: string
}

// LATEST FROM ERD
export type IMemberContactReferenceRequest = z.infer<
    typeof MemberContactReferenceSchema
>
