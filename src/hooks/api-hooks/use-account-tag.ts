import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AccountTagServices } from '@/api-service/accounting-services'
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
    IAccounTagRequest,
    IAccountTag,
    IAccountTagPaginated,
    IQueryProps,
    TEntityId,
} from '@/types'

const KEY = 'account-tags'

export const useCreateAccountTag = createMutationHook<
    IAccountTag,
    string,
    IAccounTagRequest
>(
    (payload) => AccountTagServices.create(payload),
    'Account Tag Created',
    (args) => createMutationInvalidateFn(KEY, args)
)

export const useUpdateAccountTag = createMutationHook<
    IAccountTag,
    string,
    {
        accountTagId: TEntityId
        data: IAccounTagRequest
    }
>(
    (payload) =>
        AccountTagServices.updateById(payload.accountTagId, payload.data),
    'Account Tag Updated',
    (args) => updateMutationInvalidationFn(KEY, args)
)

export const useDeleteAccountTag = createMutationHook<void, string, TEntityId>(
    (accountTagId) => AccountTagServices.deleteById(accountTagId),
    'Account Tag Deleted',
    (args) => deleteMutationInvalidationFn(KEY, args)
)

export const useDeleteAccountTagsBulk = createMutationHook<
    void,
    string,
    TEntityId[]
>(
    (accountTagIds) => AccountTagServices.deleteMany(accountTagIds),
    'Account Tags Deleted',
    (args) => deleteMutationInvalidationFn(KEY, args)
)

export const useGetAllAccountTag = () => {
    return useQuery<IAccountTag[], string>({
        queryKey: [KEY, 'all'],
        queryFn: async () => {
            const [error, response] = await withCatchAsync(
                AccountTagServices.allList()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }

            return response
        },
    })
}

export const useFilteredPaginatedAccountTag = ({
    sort,
    enabled,
    initialData,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IAccountTag, string> &
    IQueryProps<IAccountTagPaginated> & { mode?: 'all' | 'pendings' }) => {
    return useQuery<IAccountTagPaginated, string>({
        queryKey: [
            'account-tags',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountTagServices.search({
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
