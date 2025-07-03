import { z } from 'zod'

import { FinancialStatementTypeEnum } from '@/types/coop-types/financial-statement-definition'

import { GeneralLedgerFinancialStatementNodeTypeEnumSchema } from '../general-ledger-definition/general-ledger-definition-schema'

export const FinancialStatementDefinitionTypesEnumSchema = z.nativeEnum(
    FinancialStatementTypeEnum
)

export const FinancialStatementDefinitionSchema = z.object({
    name: z.string().min(1, 'The name is required!'),
    description: z.string().optional(),

    exclude: z.boolean().optional(),
    index: z.coerce.number().optional(),
    type: GeneralLedgerFinancialStatementNodeTypeEnumSchema,
    name_in_total: z.string().optional(),
    is_posting: z.boolean().optional(),
    financial_statement_type: FinancialStatementDefinitionTypesEnumSchema,
})
