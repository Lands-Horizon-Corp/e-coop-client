import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import LoanPurposeService from '@/api-service/loan-service/loan-purpose-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    ILoanPurpose,
    ILoanPurposeRequest,
    ILoanPurposePaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'

export const useCreateLoanPurpose = createMutationHook<
    ILoanPurpose,
    string,
    ILoanPurposeRequest
>(
    (data) => LoanPurposeService.create(data),
    'Loan purpose created',
    (args) => createMutationInvalidateFn('loan-purpose', args)
)

export const useUpdateLoanPurpose = createMutationHook<
    ILoanPurpose,
    string,
    { id: TEntityId; data: ILoanPurposeRequest }
>(
    ({ id, data }) => LoanPurposeService.updateById(id, data),
    'Loan purpose updated',
    (args) => updateMutationInvalidationFn('loan-purpose', args)
)

export const useDeleteLoanPurpose = createMutationHook<void, string, TEntityId>(
    (id) => LoanPurposeService.deleteById(id),
    'Loan purpose deleted',
    (args) => deleteMutationInvalidationFn('loan-purpose', args)
)

export const useLoanPurposeList = ({
    enabled,
    showMessage = true,
}: IAPIHook<ILoanPurpose[], string> & IQueryProps = {}) => {
    return useQuery<ILoanPurpose[], string>({
        queryKey: ['loan-purpose', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                LoanPurposeService.allList()
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

export const useFilteredPaginatedLoanPurpose = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ILoanPurposePaginated, string> &
    IQueryProps = {}) => {
    return useQuery<ILoanPurposePaginated, string>({
        queryKey: [
            'loan-purpose',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                LoanPurposeService.search({
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
