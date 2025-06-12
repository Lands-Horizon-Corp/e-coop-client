import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { createMutationHook } from './api-hook-factory'
import * as BankService from '@/api-service/bank-service'

import {
    IBank,
    IAPIHook,
    TEntityId,
    IQueryProps,
    IBankRequest,
    IBankPaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'

export const useCreateBank = createMutationHook<IBank, string, IBankRequest>(
    (data) => BankService.createBank(data),
    'Bank created'
)

export const useUpdateBank = createMutationHook<
    IBank,
    string,
    { bankId: TEntityId; data: IBankRequest }
>(({ bankId, data }) => BankService.updateBank(bankId, data), 'Bank updated')

export const useDeleteBank = createMutationHook<void, string, TEntityId>(
    (id) => BankService.deleteBank(id),
    'Bank deleted'
)

export const useBanks = ({
    enabled,
    showMessage = true,
}: IAPIHook<IBank[], string> & IQueryProps = {}) => {
    return useQuery<IBank[], string>({
        queryKey: ['bank', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                BankService.getAllBanks()
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

export const useFilteredPaginatedBanks = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IBankPaginated, string> & IQueryProps = {}) => {
    return useQuery<IBankPaginated, string>({
        queryKey: ['bank', 'resource-query', filterPayload, pagination, sort],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                BankService.getPaginatedBanks({
                    pagination,
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
