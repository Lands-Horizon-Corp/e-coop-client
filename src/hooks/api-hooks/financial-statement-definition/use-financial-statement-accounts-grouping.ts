import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { FinancialStatementAccountsGroupingsServices } from '@/api-service/financial-statement-services'
import {
    createMutationHook,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import {
    IFinancialStatementAccountsGrouping,
    IFinancialStatementAccountsGroupingRequest,
} from '@/types/coop-types/financial-statement-accounts-grouping'
import { withCatchAsync } from '@/utils'

import { IAPIHook, IQueryProps, TEntityId } from '@/types'

export const useGetAllFinancialStatementAccountsGroupings = ({
    enabled,
    showMessage = true,
}: IAPIHook<IFinancialStatementAccountsGrouping[], string> &
    IQueryProps = {}) => {
    return useQuery<IFinancialStatementAccountsGrouping[], string>({
        queryKey: ['financial-statement-groupings'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                FinancialStatementAccountsGroupingsServices.getAllFinancialStatementAccountsGrouping()
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

export const useUpdateFinancialStatementAccountsGrouping = createMutationHook<
    IFinancialStatementAccountsGrouping,
    string,
    {
        financialStatementAccountsGroupingId: TEntityId
        data: IFinancialStatementAccountsGroupingRequest
    }
>(
    (payload) =>
        FinancialStatementAccountsGroupingsServices.updateFinancialStatementAccountsGrouping(
            payload.financialStatementAccountsGroupingId,
            payload.data
        ),
    'Financial statement grouping updated',
    (args) =>
        updateMutationInvalidationFn('financial-statement-groupings', args)
)
