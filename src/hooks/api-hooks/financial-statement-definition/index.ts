import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { FinancialStatementDefinitionServices } from '@/api-service/financial-statement-services'
import { serverRequestErrExtractor } from '@/helpers'
import {
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionRequest,
} from '@/types/coop-types/financial-statement-definition'
import { withCatchAsync } from '@/utils'

import { IAPIHook, IQueryProps, TEntityId } from '@/types'

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
    'New Financial Statement Definition Created',
    (args) => createMutationInvalidateFn('financial-statement-definition', args)
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
    'Financial Statement Definition Updated',
    (args) =>
        updateMutationInvalidationFn('financial-statement-definition', args)
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
    'Financial Statement Definition Deleted',
    (args) =>
        deleteMutationInvalidationFn('financial-statement-definition', args)
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
export const useGetALlFinancialStatement = ({
    enabled,
    showMessage = true,
}: IAPIHook<IFinancialStatementDefinition[], string> & IQueryProps = {}) => {
    return useQuery<IFinancialStatementDefinition[], string>({
        queryKey: ['financial-statement-definition', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                FinancialStatementDefinitionServices.getAllFinancialStatementDefinition()
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}
