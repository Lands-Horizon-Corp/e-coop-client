import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../../factory/api-hook-factory'
import BankService from '@/api-service/bank-service'

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
    (data) => BankService.create(data),
    'Bank created',
    (args) => createMutationInvalidateFn('bank', args)
)

export const useUpdateBank = createMutationHook<
    IBank,
    string,
    { bankId: TEntityId; data: IBankRequest }
>(
    ({ bankId, data }) => BankService.updateById(bankId, data),
    'Bank updated',
    (args) => updateMutationInvalidationFn('bank', args)
)

export const useDeleteBank = createMutationHook<void, string, TEntityId>(
    (id) => BankService.deleteById(id),
    'Bank deleted',
    (args) => deleteMutationInvalidationFn('bank', args)
)

export const useBanks = ({
    enabled,
    showMessage = true,
}: IAPIHook<IBank[], string> & IQueryProps = {}) => {
    return useQuery<IBank[], string>({
        queryKey: ['bank', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(BankService.allList())

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
                BankService.search({
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
