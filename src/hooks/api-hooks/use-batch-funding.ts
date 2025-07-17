import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as BatchFundingService from '@/api-service/batch-funding-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IBatchFunding,
    IBatchFundingPaginated,
    IBatchFundingRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

import { createMutationHook } from '../../factory/api-hook-factory'

export const useCreateBatchFunding = createMutationHook<
    IBatchFunding,
    string,
    IBatchFundingRequest
>((vars) => BatchFundingService.createBatchFund(vars), 'Added to batch fund')

export const useFilteredBatchFunding = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    transactionBatchId,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IBatchFundingPaginated, string> &
    IQueryProps & {
        transactionBatchId: TEntityId
    }) => {
    return useQuery<IBatchFundingPaginated, string>({
        queryKey: [
            'batch-funding',
            'transaction-batch',
            transactionBatchId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                BatchFundingService.getPaginatedBatchOnlineEntry({
                    pagination,
                    transactionBatchId,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
