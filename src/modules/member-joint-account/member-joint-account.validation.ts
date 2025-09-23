import z from 'zod'

import {
    descriptionTransformerSanitizer,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'

import { FamilyRelationshipSchema } from '../member-relative-account'

export const MemberJointAccountSchema = z.object({
    id: z.string().optional(),

    picture_media_id: entityIdSchema,
    picture_media: z.any(),
    signature_media_id: entityIdSchema,
    signature_media: z.any(),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last name is required'),
    suffix: z.string().optional(),
    birthday: stringDateWithTransformSchema,
    family_relationship: FamilyRelationshipSchema,
})
