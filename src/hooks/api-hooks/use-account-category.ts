import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AccountCategoryServices } from '@/api-service/account-category-services'
import { serverRequestErrExtractor } from '@/helpers'
import { IAPIFilteredPaginatedHook, IQueryProps } from '@/types/api-hooks-types'
import {
    IAccountCategory,
    IAccountCategoryPaginatedResource,
    IAccountCategoryRequest,
} from '@/types/coop-types/account-category'
import { toBase64, withCatchAsync } from '@/utils'

import { TEntityId } from '@/types'

import { createMutationHook } from '../../factory/api-hook-factory'

export const useFilteredPaginatedAccountCategory = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IAccountCategoryPaginatedResource, string> &
    IQueryProps = {}) => {
    return useQuery<IAccountCategoryPaginatedResource, string>({
        queryKey: [
            'account_category', // Unique query key for account category
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

export const useCreateAccountCategory = createMutationHook<
    IAccountCategory,
    string,
    IAccountCategoryRequest
>(
    (payload) => AccountCategoryServices.createAccountCategory(payload),
    'New Account Category Created'
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
    'Account Category Updated'
)

export const useDeleteAccountCategory = createMutationHook<
    void,
    string,
    TEntityId
>(
    (accountCategoryId) =>
        AccountCategoryServices.deleteAccountCategory(accountCategoryId),
    'Account Category Deleted'
)

export const useGetAccountCategoryById = (
    accountCategoryId?: TEntityId,
    showMessage = true
) => {
    return useQuery<IAccountCategory, string>({
        queryKey: ['account_category', accountCategoryId],
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
