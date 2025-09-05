import z from 'zod'

const headerSchema = z.number().int().optional()

export const ChargesRateByTermHeaderRequestSchema = z.object({
    header_1: headerSchema,
    header_2: headerSchema,
    header_3: headerSchema,
    header_4: headerSchema,
    header_5: headerSchema,
    header_6: headerSchema,
    header_7: headerSchema,
    header_8: headerSchema,
    header_9: headerSchema,
    header_10: headerSchema,
    header_11: headerSchema,
    header_12: headerSchema,
    header_13: headerSchema,
    header_14: headerSchema,
    header_15: headerSchema,
    header_16: headerSchema,
    header_17: headerSchema,
    header_18: headerSchema,
    header_19: headerSchema,
    header_20: headerSchema,
    header_21: headerSchema,
    header_22: headerSchema,
})

export type ChargesRateByTermHeaderFormValues = z.infer<
    typeof ChargesRateByTermHeaderRequestSchema
>
