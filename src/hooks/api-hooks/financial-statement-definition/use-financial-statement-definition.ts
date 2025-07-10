import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { FinancialStatementDefinitionServices } from '@/api-service/financial-statement-services'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import { IFinancialStatementDefinition } from '@/types'
import { IAPIHook, IQueryProps } from '@/types'

export const useGetAllFinancialStatementAccountsGroupings = ({
    enabled,
    showMessage = true,
}: IAPIHook<IFinancialStatementDefinition[], string> & IQueryProps = {}) => {
    return useQuery<IFinancialStatementDefinition[], string>({
        queryKey: ['general-ledger-accounts-groupings'],
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
