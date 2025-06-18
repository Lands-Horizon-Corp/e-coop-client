import {
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionRequest,
} from '@/types/coop-types/financial-statement-definition'
import { createMutationHook } from '../api-hook-factory'
import { TEntityId } from '@/types'
import { FinancialStatementDefinitionServices } from '@/api-service/financial-statement-services'

export const useCreateFinancialStatementDefinition = createMutationHook<
    IFinancialStatementDefinition,
    string,
    IFinancialStatementDefinitionRequest
>(
    (payload) =>
        FinancialStatementDefinitionServices.createFinancialStatementDefinition(
            payload
        ),
    'New Financial Statement Definition Created'
)

export const useUpdateFinancialStatementDefinition = createMutationHook<
    IFinancialStatementDefinition,
    string,
    {
        financialStatementDefinitionId: TEntityId
        data: IFinancialStatementDefinitionRequest
    }
>(
    (payload) =>
        FinancialStatementDefinitionServices.updateFinancialStatementDefinition(
            payload.financialStatementDefinitionId,
            payload.data
        ),
    'Financial Statement Definition Updated'
)

export const useDeleteFinancialStatementDefinition = createMutationHook<
    void,
    string,
    TEntityId
>(
    (financialStatementDefinitionId) =>
        FinancialStatementDefinitionServices.deleteFinancialStatementDefinition(
            financialStatementDefinitionId
        ),
    'Financial Statement Definition Deleted'
)

export const useDeleteManyFinancialStatementDefinitions = createMutationHook<
    void,
    string,
    TEntityId[]
>(
    (ids) =>
        FinancialStatementDefinitionServices.deleteManyFinancialStatementDefinitions(
            ids
        ),
    'Financial Statement Definitions Deleted'
)
