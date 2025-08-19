import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import { descriptionSchema, entityIdSchema } from '@/validation'

import { IAccount } from '../account'
import { IFinancialStatementGroupingResponse } from '../financial-statement-account-grouping'

export interface IFinancialStatementDefinitionRequest {
    name: string
    description?: string
    index?: number
    name_in_total?: string
    is_posting?: boolean
    financial_statement_type?: string
    financial_statement_definition_entries_id?: TEntityId
    financial_statement_grouping_id?: TEntityId
}

export interface IFinancialStatementDefinitionResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    financial_statement_definition_entries_id?: TEntityId
    financial_statement_definition_entries?: IFinancialStatementDefinitionResponse[]
    financial_statement_grouping_id?: TEntityId
    financial_statement_grouping?: IFinancialStatementGroupingResponse
    accounts?: IAccount
    name: string
    description: string
    index: number
    name_in_total: string
    is_posting: boolean
    financial_statement_type: string
}

export const financialStatementDefinitionRequestSchema = z.object({
    name: z.string().min(1).max(255),
    description: descriptionSchema.optional(),
    index: z.number().optional(),
    name_in_total: z.string().optional(),
    is_posting: z.boolean().optional(),
    financial_statement_type: z.string().optional(),
    financial_statement_definition_entries_id: entityIdSchema
        .optional()
        .nullable(),
    financial_statement_grouping_id: entityIdSchema.optional().nullable(),
})
