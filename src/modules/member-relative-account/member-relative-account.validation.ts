import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

import { FAMILY_RELATIONSHIP } from './member-relative.constants'

export const FamilyRelationshipSchema = z.enum(FAMILY_RELATIONSHIP) // Member profile

// STRICTLY BASED ON IMemberRelativeAccountRequest
export const MemberRelativeAccountSchema = z.object({
    id: z.string().optional(),
    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    organization: z.any(),
    member_profile_id: entityIdSchema,
    relative_member_profile_id: entityIdSchema,
    relative_member: z.any(),
    family_relationship: FamilyRelationshipSchema,
    description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
})
