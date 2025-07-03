import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import GenderService from '@/api-service/member-services/member-gender-service'
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
    IAPIHook,
    IMemberGender,
    IMemberGenderPaginated,
    IMemberGenderRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateGender = createMutationHook<
    IMemberGender,
    string,
    IMemberGenderRequest
>(
    (data) => GenderService.create(data),
    'Member Gender Created',
    (args) => createMutationInvalidateFn('member-gender', args)
)

export const useUpdateGender = createMutationHook<
    IMemberGender,
    string,
    { genderId: TEntityId; data: IMemberGenderRequest }
>(
    ({ genderId, data }) => GenderService.updateById(genderId, data),
    'Member Gender Updated',
    (args) => updateMutationInvalidationFn('member-gender', args)
)

export const useDeleteGender = createMutationHook<void, string, TEntityId>(
    (genderId) => GenderService.deleteById(genderId),
    'Member Gender Deleted',
    (args) => deleteMutationInvalidationFn('member-gender', args)
)

export const useGenders = ({
    enabled,
    showMessage = true,
}: IAPIHook<IMemberGender[], string> & IQueryProps = {}) => {
    return useQuery<IMemberGender[], string>({
        queryKey: ['gender', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GenderService.allList()
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

export const useFilteredPaginatedGenders = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberGenderPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberGenderPaginated, string>({
        queryKey: [
            'member-gender',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GenderService.search({
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
