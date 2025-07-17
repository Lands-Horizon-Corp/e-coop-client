import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as CashCountService from '@/api-service/cash-count-service'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import {
    IAPIHook,
    ICashCount,
    ICashCountBatchRequest,
    IQueryProps,
} from '@/types'

import { createMutationHook } from '../../factory/api-hook-factory'

export const useCurrentBatchCashCounts = ({
    enabled,
    showMessage = true,
}: IAPIHook<ICashCount[], string> & IQueryProps = {}) => {
    return useQuery<ICashCount[], string>({
        queryKey: ['cash-count', 'transaction-batch', 'current'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CashCountService.getCurrentBatchCashCounts()
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

export const useUpdateBatchCashCounts = createMutationHook<
    ICashCount[],
    string,
    ICashCountBatchRequest
>(
    (data) => CashCountService.updateBatchCashCount(data),
    'Batch cash count updated'
)
