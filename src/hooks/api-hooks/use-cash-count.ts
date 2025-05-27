import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as CashCountService from '@/api-service/cash-count-service'

import {
    IAPIHook,
    ICashCount,
    ICashCountBatchRequest,
    IQueryProps,
} from '@/types'
import { createMutationHook } from './api-hook-factory'

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
        initialData: [
            // {
            //     id: '11111111-aaaa-bbbb-cccc-111111111111',
            //     transaction_batch_id: '33333333-cccc-dddd-eeee-333333333333',
            //     country_code: 'PH',
            //     bill_amount: 100,
            //     quantity: 5,
            //     amount: 500,
            //     created_at: '2024-05-01T10:00:00Z',
            //     updated_at: '2024-05-01T10:00:00Z',
            //     deleted_at: null,
            // },
            // {
            //     id: '22222222-bbbb-cccc-dddd-222222222222',
            //     transaction_batch_id: '33333333-cccc-dddd-eeee-333333333333',
            //     country_code: 'PH',
            //     bill_amount: 50,
            //     quantity: 10,
            //     amount: 500,
            //     created_at: '2024-05-01T10:00:00Z',
            //     updated_at: '2024-05-01T10:00:00Z',
            //     deleted_at: null,
            // },
            // {
            //     id: '33333333-cccc-dddd-eeee-333333333333',
            //     transaction_batch_id: '33333333-cccc-dddd-eeee-333333333333',
            //     country_code: 'PH',
            //     bill_amount: 20,
            //     quantity: 20,
            //     amount: 400,
            //     created_at: '2024-05-01T10:00:00Z',
            //     updated_at: '2024-05-01T10:00:00Z',
            //     deleted_at: null,
            // },
            // {
            //     id: '44444444-dddd-eeee-ffff-444444444444',
            //     transaction_batch_id: '33333333-cccc-dddd-eeee-333333333333',
            //     country_code: 'PH',
            //     bill_amount: 10,
            //     quantity: 50,
            //     amount: 500,
            //     created_at: '2024-05-01T10:00:00Z',
            //     updated_at: '2024-05-01T10:00:00Z',
            //     deleted_at: null,
            // },
            // {
            //     id: '55555555-eeee-ffff-aaaa-555555555555',
            //     transaction_batch_id: '33333333-cccc-dddd-eeee-333333333333',
            //     country_code: 'PH',
            //     bill_amount: 7,
            //     quantity: 100,
            //     amount: 500,
            //     created_at: '2024-05-01T10:00:00Z',
            //     updated_at: '2024-05-01T10:00:00Z',
            //     deleted_at: null,
            // }
        ] as unknown as ICashCount[],
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
