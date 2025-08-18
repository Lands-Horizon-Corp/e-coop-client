import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    descriptionSchema,
    entityIdSchema,
} from '../common'
import { IFinancialStatementDefinitionResponse } from '../financial-statement-definition/financial-statement-definition.types'
import { IMedia } from '../media/media.types'

const AccountingPrinciple = z.enum([
    'asset',
    'liability',
    'equity',
    'income',
    'expense',
])

export interface IFinancialStatementGroupingRequest {
    organization_id: TEntityId
    branch_id: TEntityId
    name: string
    description: string
    debit: z.infer<typeof AccountingPrinciple>
    credit: z.infer<typeof AccountingPrinciple>
    code: number
    icon_media_id?: TEntityId
}

export interface IFinancialStatementGroupingResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    icon_media_id?: TEntityId
    icon_media?: IMedia
    name: string
    description: string
    debit: z.infer<typeof AccountingPrinciple>
    credit: z.infer<typeof AccountingPrinciple>
    code: number
    financial_statement_definition_entries?: IFinancialStatementDefinitionResponse[]
}

export const financialStatementGroupingRequestSchema = z.object({
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    name: z.string().min(1).max(50),
    description: descriptionSchema,
    debit: AccountingPrinciple,
    credit: AccountingPrinciple,
    code: z.number(),
    icon_media_id: entityIdSchema.optional().nullable(),
})
