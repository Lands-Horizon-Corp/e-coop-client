import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AccountCategoryServices } from '@/api-service/account-category-services'
import { serverRequestErrExtractor } from '@/helpers'
import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IQueryProps,
} from '@/types/api-hooks-types'
import {
    IAccountCategory,
    IAccountCategoryPaginated,
    IAccountCategoryRequest,
} from '@/types/coop-types/account-category'
import { toBase64, withCatchAsync } from '@/utils'

import { TEntityId } from '@/types'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../../factory/api-hook-factory'

export const useFilteredPaginatedAccountCategory = ({
    sort,
    enabled,
    filterPayload,
    initialData,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IAccountCategoryPaginated, string> &
    IQueryProps<IAccountCategoryPaginated> = {}) => {
    return useQuery<IAccountCategoryPaginated, string>({
        queryKey: [
            'account-category',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountCategoryServices.getPaginatedAccountCategories({
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
        initialData: initialData ?? {
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

export const useCreateAccountCategory = createMutationHook<
    IAccountCategory,
    string,
    IAccountCategoryRequest
>(
    (payload) => AccountCategoryServices.createAccountCategory(payload),
    'New Account Category Created',
    (args) => createMutationInvalidateFn('account-category', args)
)

export const useUpdateAccountCategory = createMutationHook<
    IAccountCategory,
    string,
    {
        accountCategoryId: TEntityId
        data: IAccountCategoryRequest
    }
>(
    (payload) =>
        AccountCategoryServices.updateAccountCategory(
            payload.accountCategoryId,
            payload.data
        ),
    'Account Category Updated',
    (args) => updateMutationInvalidationFn('account-category', args)
)

export const useDeleteAccountCategory = createMutationHook<
    void,
    string,
    TEntityId
>(
    (accountCategoryId) =>
        AccountCategoryServices.deleteAccountCategory(accountCategoryId),
    'Account Category Deleted',
    (args) => deleteMutationInvalidationFn('account-category', args)
)

export const useGetAccountCategoryById = (
    accountCategoryId?: TEntityId,
    showMessage = true
) => {
    return useQuery<IAccountCategory, string>({
        queryKey: ['account-category', accountCategoryId],
        queryFn: async () => {
            if (!accountCategoryId) {
                throw new Error(
                    'Account Category ID is required to fetch details.'
                )
            }
            const [error, result] = await withCatchAsync(
                AccountCategoryServices.getAccountCategoryById(
                    accountCategoryId
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        enabled: !!accountCategoryId,
        retry: 1,
    })
}

export const useAccountCategory = ({
    enabled,
    showMessage = true,
}: IAPIHook<IAccountCategory[], string> & IQueryProps = {}) => {
    return useQuery<IAccountCategory[], string>({
        queryKey: ['account-category', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountCategoryServices.getAllAccountCategories()
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
