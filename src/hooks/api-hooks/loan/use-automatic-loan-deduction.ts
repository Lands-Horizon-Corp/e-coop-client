import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import automaticLoanDeductionService from '@/api-service/loan-service/loan-scheme/automatic-loan-deduction-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import { TSortingState } from '@/hooks/use-sorting-state'

import {
    IAPIFilteredHook,
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IAutomaticLoanDeduction,
    IAutomaticLoanDeductionPaginated,
    IAutomaticLoanDeductionRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateAutomaticLoanDeduction = createMutationHook<
    IAutomaticLoanDeduction,
    string,
    IAutomaticLoanDeductionRequest
>(
    (data) => automaticLoanDeductionService.create(data),
    'Automatic loan deduction added',
    (args) => {
        createMutationInvalidateFn('automatic-loan-deduction', args)
        args.queryClient.invalidateQueries({
            queryKey: [
                'automatic-loan-deduction',
                'all',
                args.payload.computation_sheet_id,
            ],
        })
    }
)

export const useUpdateAutomaticLoanDeduction = createMutationHook<
    IAutomaticLoanDeduction,
    string,
    { id: TEntityId; data: IAutomaticLoanDeductionRequest }
>(
    ({ id, data }) => automaticLoanDeductionService.updateById(id, data),
    'Updated automatic loan deduction',
    (args) => {
        updateMutationInvalidationFn('automatic-loan-deduction', args)
        args.queryClient.invalidateQueries({
            queryKey: [
                'automatic-loan-deduction',
                'all',
                args.payload.data.computation_sheet_id,
            ],
        })
    }
)

export const useDeleteAutomaticLoanDeduction = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => automaticLoanDeductionService.deleteById(id),
    'deleted automatic loan deduction',
    (args) => {
        deleteMutationInvalidationFn('automatic-loan-deduction', args)
        args.queryClient.invalidateQueries({
            queryKey: ['automatic-loan-deduction', 'all'],
        })
    }
)

export const useAutomaticLoanDeductionSheet = ({
    enabled,
    schemeId,
    showMessage = true,
    ...rest
}: IAPIHook<IAutomaticLoanDeduction, string> &
    IQueryProps<IAutomaticLoanDeduction> & { schemeId: TEntityId }) => {
    return useQuery<IAutomaticLoanDeduction, string>({
        queryKey: ['automatic-loan-deduction', schemeId],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                automaticLoanDeductionService.getById(schemeId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        enabled,
        retry: 1,
        ...rest,
    })
}

export const useFilteredPaginatedAutomaticLoanDeduction = ({
    sort,
    enabled,
    schemeId,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IAutomaticLoanDeductionPaginated, string> &
    IQueryProps<IAutomaticLoanDeduction[]> & {
        schemeId?: TEntityId
    }) => {
    return useQuery<IAutomaticLoanDeductionPaginated, string>({
        queryKey: [
            'automatic-loan-deduction',
            'resource-query',
            'scheme',
            schemeId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                automaticLoanDeductionService.search({
                    base:
                        schemeId !== undefined
                            ? `schem/${schemeId}/search`
                            : undefined,
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

export const useAutomaticLoanDeductions = ({
    sort,
    filter,
    enabled,
    computationSheetId,
    showMessage = true,
}: IAPIFilteredHook<IAutomaticLoanDeduction[], string> & {
    computationSheetId: TEntityId
    filter?: Record<string, unknown>
    sort?: TSortingState
}) => {
    return useQuery<IAutomaticLoanDeduction[], string>({
        queryKey: [
            'automatic-loan-deduction',
            'all',
            computationSheetId,
            filter,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                automaticLoanDeductionService.allList({
                    base: `automatic-loan-deduction/computation-sheet/${computationSheetId}`,
                    sort: sort && toBase64(sort),
                    filter: filter && toBase64(filter),
                })
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
