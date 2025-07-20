import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import browseExcludeIncludeAccountService from '@/api-service/loan-service/loan-scheme/browse-exclude-include-account-service'
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
    IBrowseExcludeIncludeAccounts,
    IBrowseExcludeIncludeAccountsRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateBrowseExcludeIncludeAccount = createMutationHook<
    IBrowseExcludeIncludeAccounts,
    string,
    IBrowseExcludeIncludeAccountsRequest
>(
    (data) => browseExcludeIncludeAccountService.create(data),
    'Added',
    (args) => {
        createMutationInvalidateFn('browse-exclude-include-accounts', args)
        args.queryClient.invalidateQueries({
            queryKey: [
                'browse-exclude-include-accounts',
                'all',
                args.payload.computation_sheet_id,
            ],
        })
    }
)

export const useUpdateBrowseExcludeIncludeAccount = createMutationHook<
    IBrowseExcludeIncludeAccounts,
    string,
    { id: TEntityId; data: IBrowseExcludeIncludeAccountsRequest }
>(
    ({ id, data }) => browseExcludeIncludeAccountService.updateById(id, data),
    'Updated',
    (args) => {
        updateMutationInvalidationFn('browse-exclude-include-accounts', args)
        args.queryClient.invalidateQueries({
            queryKey: [
                'browse-exclude-include-accounts',
                'all',
                args.payload.data.computation_sheet_id,
            ],
        })
    }
)

export const useDeleteBrowseExcludeIncludeAccounts = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => browseExcludeIncludeAccountService.deleteById(id),
    'Deleted',
    (args) => {
        deleteMutationInvalidationFn('browse-exclude-include-accounts', args)
        args.queryClient.invalidateQueries({
            queryKey: ['browse-exclude-include-accounts', 'all'],
        })
    }
)

export const useBrowseExcludeIncludeAccount = ({
    enabled,
    schemeId,
    showMessage = true,
    ...rest
}: IAPIHook<IBrowseExcludeIncludeAccounts, string> &
    IQueryProps<IBrowseExcludeIncludeAccounts> & { schemeId: TEntityId }) => {
    return useQuery<IBrowseExcludeIncludeAccounts, string>({
        queryKey: ['browse-exclude-include-accounts', schemeId],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                browseExcludeIncludeAccountService.getById(schemeId)
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

export const useBrowseExcludeIncludeAccounts = ({
    sort,
    filter,
    enabled,
    computationSheetId,
    showMessage = true,
}: IAPIFilteredHook<IBrowseExcludeIncludeAccounts[], string> & {
    computationSheetId: TEntityId
    filter?: Record<string, unknown>
    sort?: TSortingState
}) => {
    return useQuery<IBrowseExcludeIncludeAccounts[], string>({
        queryKey: [
            'browse-exclude-include-accounts',
            'all',
            computationSheetId,
            filter,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                browseExcludeIncludeAccountService.allList({
                    base: `browse-exclude-include-accountss/computation-sheet/${computationSheetId}`,
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
