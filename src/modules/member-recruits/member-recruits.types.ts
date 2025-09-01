import z from 'zod'

import { ITimeStamps, TEntityId } from '@/types/common'
import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberRecruitedMembers extends ITimeStamps {
    id: TEntityId
    membersProfileId: TEntityId
    membersProfileRecruitedId: TEntityId
    dateRecruited: string
    description: string
    name: string
    membersProfile: IMemberProfile
    membersProfileRecruited: IMemberProfile
}

export const memberRecruitsSchema = z.object({
    id: entityIdSchema.optional(),
    membersProfileId: entityIdSchema.optional(),
    membersProfileRecruitedId: entityIdSchema,
    dateRecruited: z.string().min(1, 'Date recruited is required'),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    name: z.string().min(1, 'Name is required'),
})
