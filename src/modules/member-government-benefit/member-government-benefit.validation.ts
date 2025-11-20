import z from 'zod'

import {
    EntityIdSchema,
    dateToISOTransformer,
    descriptionTransformerSanitizer,
    entityIdSchema,
    stringDateSchema,
} from '@/validation'

import { IGovernmentId } from './member-government-benefit.types'

export const MemberGovernmentBenefitSchema = z
    .object({
        id: entityIdSchema.optional(),
        name: z.string().min(1, 'Name is required'),

        member_profile_id: entityIdSchema,
        organization_id: entityIdSchema.optional(),
        branch_id: entityIdSchema.optional(),

        government: z.any().optional(),

        country_code: z.string().min(1, 'Country is required'),
        value: z.string().min(1, 'Value is required'),
        expiry_date: stringDateSchema
            .transform(dateToISOTransformer)
            .optional(),
        description: z.coerce
            .string()
            .optional()
            .transform(descriptionTransformerSanitizer),
        front_media_id: EntityIdSchema('Front ID Photo required'),
        front_media: z.any(),
        back_media_id: EntityIdSchema('Back ID Photo is required'),
        back_media: z.any(),
    })
    .superRefine((data, ctx) => {
        const government: IGovernmentId | undefined = data.government

        if (!government) {
            return
        }

        if (government.regex) {
            const regex = new RegExp(government.regex)
            if (!regex.test(data.value)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Invalid government ID format',
                    path: ['value'],
                })
            }
        }

        if (government.has_expiry_date && !data.expiry_date) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Expiry date is required for this government ID',
                path: ['expiry_date'],
            })
        }
    })

export type TMemberGovernmentBenefitSchema = z.infer<
    typeof MemberGovernmentBenefitSchema
>
