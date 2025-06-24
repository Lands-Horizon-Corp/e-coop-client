import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { IAPIFilteredPaginatedHook, IQueryProps } from '@/types/api-hooks-types'

import { withCatchAsync, toBase64 } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { createMutationHook } from '../../factory/api-hook-factory'
import { AccountClassificationServices } from '@/api-service/account-classification-services'

import {
    TEntityId,
    IAccountClassification,
    IAccountClassificationRequest,
    IAccountClassificationPaginatedResource,
} from '@/types'

export const useFilteredPaginatedAccountClassification = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IAccountClassificationPaginatedResource, string> &
    IQueryProps = {}) => {
    return useQuery<IAccountClassificationPaginatedResource, string>({
        queryKey: [
            'account_classification',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountClassificationServices.getPaginatedAccountClassifications(
                    {
                        pagination,
                        sort: sort && toBase64(sort),
                        filters: filterPayload && toBase64(filterPayload),
                    }
                )
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

export const useCreateAccountClassification = createMutationHook<
    IAccountClassification,
    string,
    IAccountClassificationRequest
>(
    (payload) =>
        AccountClassificationServices.createAccountClassification(payload),
    'New Account Classification Created'
)

export const useUpdateAccountClassification = createMutationHook<
    IAccountClassification,
    string,
    {
        accountClassificationId: TEntityId
        data: IAccountClassificationRequest
    }
>(
    (payload) =>
        AccountClassificationServices.updateAccountClassification(
            payload.accountClassificationId,
            payload.data
        ),
    'Account Classification Updated'
)

export const useDeleteAccountClassification = createMutationHook<
    void,
    string,
    TEntityId
>(
    (accountclassificationId) =>
        AccountClassificationServices.deleteAccountClassification(
            accountclassificationId
        ),
    'Account Classification Deleted'
)
