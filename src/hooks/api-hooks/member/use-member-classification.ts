import { toast } from 'sonner'
import { useQuery, queryOptions } from '@tanstack/react-query'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import MemberClassificationService from '@/api-service/member-services/member-classification-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    IMemberClassification,
    IAPIFilteredPaginatedHook,
    IMemberClassificationRequest,
    IMemberClassificationPaginated,
} from '@/types'

export const memberClassificationLoader = (classificationId: TEntityId) =>
    queryOptions<IMemberClassification>({
        queryKey: ['member-classification', 'loader', classificationId],
        queryFn: async () => {
            const data =
                await MemberClassificationService.getById(classificationId)
            return data
        },
        retry: 0,
    })

export const useCreateMemberClassification = createMutationHook<
    IMemberClassification,
    string,
    IMemberClassificationRequest
>(
    (args) => MemberClassificationService.create(args),
    'Member Center Created',
    (args) => createMutationInvalidateFn('member-classification', args)
)

export const useUpdateMemberClassification = createMutationHook<
    IMemberClassification,
    string,
    { classificationId: TEntityId; data: IMemberClassificationRequest }
>(
    ({ classificationId, data }) =>
        MemberClassificationService.updateById(classificationId, data),
    'Member Classification Updated',
    (args) => updateMutationInvalidationFn('member-classification', args)
)

export const useDeleteMemberClassification = createMutationHook<
    void,
    string,
    TEntityId
>(
    (classificationId) =>
        MemberClassificationService.deleteById(classificationId),
    'Member Classifcation Deleted',
    (args) => deleteMutationInvalidationFn('member-classification', args)
)

export const useMemberClassifications = ({
    enabled,
    showMessage,
}: IAPIHook<IMemberClassification[], string> & IQueryProps = {}) => {
    return useQuery<IMemberClassification[], string>({
        queryKey: ['member-classification', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberClassificationService.allList()
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

export const useFilteredPaginatedMemberClassifications = ({
    sort,
    enabled,
    showMessage,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberClassificationPaginated, string> = {}) => {
    return useQuery<IMemberClassificationPaginated, string>({
        queryKey: [
            'member-classification',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberClassificationService.search({
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
