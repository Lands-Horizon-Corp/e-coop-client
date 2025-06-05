import z from 'zod'
import { entityIdSchema } from '../common'

export const batchSignSchema = z.object({
    prepared_by_signature_media_id: entityIdSchema.optional(),
    prepared_by_signature_media: z.any(),
    prepared_by_name: z.string().optional(),
    prepared_by_position: z.string().optional(),

    certified_by_signature_media_id: entityIdSchema.optional(),
    certified_by_signature_media: z.any(),
    certified_by_name: z.string().optional(),
    certified_by_position: z.string().optional(),

    checked_by_signature_media_id: entityIdSchema.optional(),
    checked_by_signature_media: z.any(),
    checked_by_name: z.string().optional(),
    checked_by_position: z.string().optional(),

    approved_by_signature_media_id: entityIdSchema.optional(),
    approved_by_signature_media: z.any(),
    approved_by_name: z.string().optional(),
    approved_by_position: z.string().optional(),

    verified_by_signature_media_id: entityIdSchema.optional(),
    verified_by_signature_media: z.any(),
    verified_by_name: z.string().optional(),
    verified_by_position: z.string().optional(),

    check_by_signature_media_id: entityIdSchema.optional(),
    check_by_signature_media: z.any(),
    check_by_name: z.string().optional(),
    check_by_position: z.string().optional(),

    acknowledge_by_signature_media_id: entityIdSchema.optional(),
    acknowledge_by_signature_media: z.any(),
    acknowledge_by_name: z.string().optional(),
    acknowledge_by_position: z.string().optional(),

    noted_by_signature_media_id: entityIdSchema.optional(),
    noted_by_signature_media: z.any(),
    noted_by_name: z.string().optional(),
    noted_by_position: z.string().optional(),

    posted_by_signature_media_id: entityIdSchema.optional(),
    posted_by_signature_media: z.any(),
    posted_by_name: z.string().optional(),
    posted_by_position: z.string().optional(),

    paid_by_signature_media_id: entityIdSchema.optional(),
    paid_by_signature_media: z.any(),
    paid_by_name: z.string().optional(),
    paid_by_position: z.string().optional(),
})
