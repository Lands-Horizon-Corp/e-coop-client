import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import includeNegativeAccountsService from '@/api-service/loan-service/loan-scheme/include-negative-accounts-service'
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
    IAPIHook,
    IIncludeNegativeAccount,
    IIncludeNegativeAccountRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateIncludeNegativeAccount = createMutationHook<
    IIncludeNegativeAccount,
    string,
    IIncludeNegativeAccountRequest
>(
    (data) => includeNegativeAccountsService.create(data),
    'Include negative account added',
    (args) => {
        createMutationInvalidateFn('include-negative-account', args)
        args.queryClient.invalidateQueries({
            queryKey: [
                'include-negative-account',
                'all',
                args.payload.computation_sheet_id,
            ],
        })
    }
)

export const useUpdateIncludeNegativeAccount = createMutationHook<
    IIncludeNegativeAccount,
    string,
    { id: TEntityId; data: IIncludeNegativeAccountRequest }
>(
    ({ id, data }) => includeNegativeAccountsService.updateById(id, data),
    'Updated include negative account',
    (args) => {
        updateMutationInvalidationFn('include-negative-account', args)
        args.queryClient.invalidateQueries({
            queryKey: [
                'include-negative-account',
                'all',
                args.payload.data.computation_sheet_id,
            ],
        })
    }
)

export const useDeleteIncludeNegativeAccount = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => includeNegativeAccountsService.deleteById(id),
    'deleted include negative account',
    (args) => {
        deleteMutationInvalidationFn('include-negative-account', args)
        args.queryClient.invalidateQueries({
            queryKey: ['include-negative-account', 'all'],
        })
    }
)

export const useIncludeNegativeAccount = ({
    enabled,
    schemeId,
    showMessage = true,
    ...rest
}: IAPIHook<IIncludeNegativeAccount, string> &
    IQueryProps<IIncludeNegativeAccount> & { schemeId: TEntityId }) => {
    return useQuery<IIncludeNegativeAccount, string>({
        queryKey: ['include-negative-account', schemeId],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                includeNegativeAccountsService.getById(schemeId)
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

export const useIncludeNegativeAccounts = ({
    sort,
    filter,
    enabled,
    computationSheetId,
    showMessage = true,
}: IAPIFilteredHook<IIncludeNegativeAccount[], string> & {
    computationSheetId: TEntityId
    filter?: Record<string, unknown>
    sort?: TSortingState
}) => {
    return useQuery<IIncludeNegativeAccount[], string>({
        queryKey: [
            'include-negative-account',
            'all',
            computationSheetId,
            filter,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                includeNegativeAccountsService.allList({
                    base: `include-negative-accounts/computation-sheet/${computationSheetId}`,
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
