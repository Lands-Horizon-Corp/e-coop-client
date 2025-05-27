import { serverRequestErrExtractor } from '@/helpers'
import { TEntityId } from '@/types'
import { IAPIFilteredPaginatedHook, IQueryProps } from '@/types/api-hooks-types'
import {
    IAccountClassificationPaginatedResource,
    IAccountClassification,
    IAccountClassificationRequest,
} from '@/types/coop-types/account-classification'
import { withCatchAsync, toBase64 } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMutationHook } from './api-hook-factory'
import { AccountClassificationServices } from '@/api-service/account-classification-services'

export const useFilteredPaginatedAccountClassification = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
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
                        preloads,
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
    {
        organizationId: TEntityId
        branchId: TEntityId
        data: IAccountClassificationRequest
    }
>(
    (payload) =>
        AccountClassificationServices.createAccountClassification(
            payload.data,
            payload.organizationId,
            payload.branchId
        ),
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
    {
        accountclassificationId: TEntityId
        organizationId: TEntityId
        branchId: TEntityId
    }
>(
    (payload) =>
        AccountClassificationServices.deleteAccountClassification(
            payload.accountclassificationId,
            payload.organizationId,
            payload.branchId
        ),
    'Account Classification Deleted'
)
