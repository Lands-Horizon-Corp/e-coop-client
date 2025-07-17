import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AccountClassificationServices } from '@/api-service/account-classification-services'
import { serverRequestErrExtractor } from '@/helpers'
import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IQueryProps,
} from '@/types/api-hooks-types'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAccountClassification,
    IAccountClassificationPaginated,
    IAccountClassificationRequest,
    TEntityId,
} from '@/types'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../../factory/api-hook-factory'

export const useAccountClassification = ({
    enabled,
    showMessage = true,
}: IAPIHook<IAccountClassification[], string> & IQueryProps = {}) => {
    return useQuery<IAccountClassification[], string>({
        queryKey: ['account-classification', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountClassificationServices.getAllAccountClassifications()
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

export const useFilteredPaginatedAccountClassification = ({
    sort,
    enabled,
    filterPayload,
    initialData,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IAccountClassificationPaginated, string> &
    IQueryProps<IAccountClassificationPaginated> = {}) => {
    return useQuery<IAccountClassificationPaginated, string>({
        queryKey: [
            'account-classification',
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

export const useCreateAccountClassification = createMutationHook<
    IAccountClassification,
    string,
    IAccountClassificationRequest
>(
    (payload) =>
        AccountClassificationServices.createAccountClassification(payload),
    'New Account Classification Created',
    (args) => createMutationInvalidateFn('account-classification', args)
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
    'Account Classification Updated',
    (args) => updateMutationInvalidationFn('account-classification', args)
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
    'Account Classification Deleted',
    (args) => deleteMutationInvalidationFn('account-classification', args)
)
