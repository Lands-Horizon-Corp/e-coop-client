import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    createQueryHook,
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../api-hook-factory'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as GenderService from '@/api-service/member-services/member-gender-service'

import {
    TEntityId,
    IQueryProps,
    IMemberGender,
    IMemberGenderRequest,
    IMemberGenderPaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'

export const useCreateGender = createMutationHook<
    IMemberGender,
    string,
    IMemberGenderRequest
>(
    (data) => GenderService.createMemberGender(data),
    'Member Gender Created',
    (args) => createMutationInvalidateFn('member-gender', args)
)

export const useUpdateGender = createMutationHook<
    IMemberGender,
    string,
    { genderId: TEntityId; data: IMemberGenderRequest }
>(
    ({ genderId, data }) => GenderService.updateMemberGender(genderId, data),
    'Member Gender Updated',
    (args) => updateMutationInvalidationFn('member-gender', args)
)

export const useDeleteGender = createMutationHook<void, string, TEntityId>(
    (genderId) => GenderService.deleteMemberGender(genderId),
    'Member Gender Deleted',
    (args) => deleteMutationInvalidationFn('member-gender', args)
)

export const useGenders = createQueryHook<IMemberGender[], string>(
    ['gender', 'all'],
    () => GenderService.getAllMemberGenders(),
    []
)

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
                GenderService.getPaginatedMemberGenders({
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
