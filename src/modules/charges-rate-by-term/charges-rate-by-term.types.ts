import { z } from 'zod'

import { ITimeStamps, entityIdSchema } from '@/types/common'

// ---------- Interfaces ----------

export interface IChargesRateByTermBase {
    id: string
    organization_id: string
    branch_id: string
    charges_rate_scheme_id: string

    name: string
    description: string
    mode_of_payment: string // ChargesModeOfPaymentType

    rate_1: number
    rate_2: number
    rate_3: number
    rate_4: number
    rate_5: number
    rate_6: number
    rate_7: number
    rate_8: number
    rate_9: number
    rate_10: number
    rate_11: number
    rate_12: number
    rate_13: number
    rate_14: number
    rate_15: number
    rate_16: number
    rate_17: number
    rate_18: number
    rate_19: number
    rate_20: number
    rate_21: number
    rate_22: number
}

export interface IChargesRateByTermResponse
    extends IChargesRateByTermBase,
        ITimeStamps {
    created_by_id: string
    updated_by_id: string

    created_by?: any // UserResponse
    updated_by?: any // UserResponse
    organization?: any // OrganizationResponse
    branch?: any // BranchResponse
    charges_rate_scheme?: any // ChargesRateSchemeResponse
}

export interface IChargesRateByTermRequest {
    charges_rate_scheme_id: string
    name?: string
    description?: string
    mode_of_payment?: string
    rate_1?: number
    rate_2?: number
    rate_3?: number
    rate_4?: number
    rate_5?: number
    rate_6?: number
    rate_7?: number
    rate_8?: number
    rate_9?: number
    rate_10?: number
    rate_11?: number
    rate_12?: number
    rate_13?: number
    rate_14?: number
    rate_15?: number
    rate_16?: number
    rate_17?: number
    rate_18?: number
    rate_19?: number
    rate_20?: number
    rate_21?: number
    rate_22?: number
}

// ---------- Zod Schemas ----------

export const ChargesRateByTermSchema = z.object({
    id: entityIdSchema,
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    charges_rate_scheme_id: entityIdSchema,

    name: z.string().max(255),
    description: z.string(),
    mode_of_payment: z.string().max(20).default('monthly'),

    rate_1: z.number().default(0),
    rate_2: z.number().default(0),
    rate_3: z.number().default(0),
    rate_4: z.number().default(0),
    rate_5: z.number().default(0),
    rate_6: z.number().default(0),
    rate_7: z.number().default(0),
    rate_8: z.number().default(0),
    rate_9: z.number().default(0),
    rate_10: z.number().default(0),
    rate_11: z.number().default(0),
    rate_12: z.number().default(0),
    rate_13: z.number().default(0),
    rate_14: z.number().default(0),
    rate_15: z.number().default(0),
    rate_16: z.number().default(0),
    rate_17: z.number().default(0),
    rate_18: z.number().default(0),
    rate_19: z.number().default(0),
    rate_20: z.number().default(0),
    rate_21: z.number().default(0),
    rate_22: z.number().default(0),
})

export const ChargesRateByTermResponseSchema = ChargesRateByTermSchema.extend({
    created_at: z.string(),
    updated_at: z.string(),
    created_by_id: entityIdSchema,
    updated_by_id: entityIdSchema,

    created_by: z.any().optional(), // UserResponse
    updated_by: z.any().optional(),
    organization: z.any().optional(),
    branch: z.any().optional(),
    charges_rate_scheme: z.any().optional(),
})

export const ChargesRateByTermRequestSchema = z.object({
    charges_rate_scheme_id: entityIdSchema,
    name: z.string().max(255).optional(),
    description: z.string().optional(),
    mode_of_payment: z.string().max(20).optional(),

    rate_1: z.number().optional(),
    rate_2: z.number().optional(),
    rate_3: z.number().optional(),
    rate_4: z.number().optional(),
    rate_5: z.number().optional(),
    rate_6: z.number().optional(),
    rate_7: z.number().optional(),
    rate_8: z.number().optional(),
    rate_9: z.number().optional(),
    rate_10: z.number().optional(),
    rate_11: z.number().optional(),
    rate_12: z.number().optional(),
    rate_13: z.number().optional(),
    rate_14: z.number().optional(),
    rate_15: z.number().optional(),
    rate_16: z.number().optional(),
    rate_17: z.number().optional(),
    rate_18: z.number().optional(),
    rate_19: z.number().optional(),
    rate_20: z.number().optional(),
    rate_21: z.number().optional(),
    rate_22: z.number().optional(),
})
