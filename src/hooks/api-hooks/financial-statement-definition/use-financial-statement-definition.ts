import { FinancialStatementDefinitionServices } from '@/api-service/financial-statement-services'

import {
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionRequest,
    TEntityId,
    UpdateIndexRequest,
} from '@/types'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../../../factory/api-hook-factory'

export const useCreateFinancialStatementDefinition = createMutationHook<
    IFinancialStatementDefinition,
    string,
    IFinancialStatementDefinitionRequest
>(
    (payload) =>
        FinancialStatementDefinitionServices.createFinancialStatementDefinition(
            payload
        ),
    'New Financial Statement Title Created',
    (args) => createMutationInvalidateFn('financial-statement-groupings', args)
)

export const useUpdateGeneralLedgerDefinition = createMutationHook<
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
    'General Ledger Definition Updated',
    (args) =>
        updateMutationInvalidationFn('financial-statement-groupings', args)
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
    'One financial statement item Deleted',
    (args) =>
        deleteMutationInvalidationFn('financial-statement-groupings', args)
)

export const useConnectAccountToFinancialStatementDefinition =
    createMutationHook<
        IFinancialStatementDefinition,
        string,
        {
            financialStatementDefinitionId: TEntityId
            accountId: TEntityId
        }
    >(
        (payload) =>
            FinancialStatementDefinitionServices.connectAccountToFinancialStatementDefinition(
                payload.financialStatementDefinitionId,
                payload.accountId
            ),
        'Account Connected/Added',
        (args) =>
            createMutationInvalidateFn('financial-statemenet-groupings', args)
    )

export const useUpdateIndexFinancialStatementDefinition = createMutationHook<
    IFinancialStatementDefinition,
    number,
    UpdateIndexRequest[]
>(
    (payload) =>
        FinancialStatementDefinitionServices.financialStatementUpdateIndex([
            ...payload,
        ]),
    undefined,
    (args) =>
        updateMutationInvalidationFn('financial-statement-groupings', args)
)
