import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import LoanStatusService from '@/api-service/loan-service/loan-status-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    ILoanStatus,
    ILoanStatusPaginated,
    ILoanStatusRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateLoanStatus = createMutationHook<
    ILoanStatus,
    string,
    ILoanStatusRequest
>(
    (data) => LoanStatusService.create(data),
    'Loan status created',
    (args) => createMutationInvalidateFn('loan-status', args)
)

export const useUpdateLoanStatus = createMutationHook<
    ILoanStatus,
    string,
    { id: TEntityId; data: ILoanStatusRequest }
>(
    ({ id, data }) => LoanStatusService.updateById(id, data),
    'Loan status updated',
    (args) => updateMutationInvalidationFn('loan-status', args)
)

export const useDeleteLoanStatus = createMutationHook<void, string, TEntityId>(
    (id) => LoanStatusService.deleteById(id),
    'Loan status deleted',
    (args) => deleteMutationInvalidationFn('loan-status', args)
)

export const useBillsAndCoins = ({
    enabled,
    showMessage = true,
}: IAPIHook<ILoanStatus[], string> & IQueryProps = {}) => {
    return useQuery<ILoanStatus[], string>({
        queryKey: ['loan-status', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                LoanStatusService.allList()
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

export const useFilteredPaginatedLoanStatus = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ILoanStatusPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<ILoanStatusPaginated, string>({
        queryKey: [
            'loan-status',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                LoanStatusService.search({
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
