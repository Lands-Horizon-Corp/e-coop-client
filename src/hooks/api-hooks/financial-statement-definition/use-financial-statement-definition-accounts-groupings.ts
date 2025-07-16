import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { FinancialStatementAccountsGroupingsServices } from '@/api-service/financial-statement-services'
import { serverRequestErrExtractor } from '@/helpers'
import { FinancialStatementGrouping } from '@/types/coop-types/financial-statement-accounts-grouping'
import { withCatchAsync } from '@/utils'

import { IAPIHook, IQueryProps } from '@/types'

export const useGetAllFinancialStatementAccountsGroupings = ({
    enabled,
    showMessage = true,
}: IAPIHook<FinancialStatementGrouping[], string> & IQueryProps = {}) => {
    return useQuery<FinancialStatementGrouping[], string>({
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
