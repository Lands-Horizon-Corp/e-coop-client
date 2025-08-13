import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import MemberDepartmentService from '@/api-service/member-services/member-department-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IMemberDepartment,
    IMemberDepartmentPaginated,
    IMemberDepartmentRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../../../factory/api-hook-factory'

export const useCreateMemberDepartment = createMutationHook<
    IMemberDepartment,
    string,
    IMemberDepartmentRequest
>(
    (data) => MemberDepartmentService.create(data),
    'Member department created',
    (args) => createMutationInvalidateFn('member-department', args)
)

export const useUpdateMemberDepartment = createMutationHook<
    IMemberDepartment,
    string,
    { memberDepartmentId: TEntityId; data: IMemberDepartmentRequest }
>(
    ({ memberDepartmentId, data }) =>
        MemberDepartmentService.updateById(memberDepartmentId, data),
    'Member department updated',
    (args) => updateMutationInvalidationFn('member-department', args)
)

export const useDeleteMemberDepartment = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => MemberDepartmentService.deleteById(id),
    'Member department deleted',
    (args) => deleteMutationInvalidationFn('member-department', args)
)

export const useMemberDepartments = ({
    enabled,
    showMessage = true,
}: IAPIHook<IMemberDepartment[], string> & IQueryProps = {}) => {
    return useQuery<IMemberDepartment[], string>({
        queryKey: ['member-department', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberDepartmentService.allList()
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

export const useFilteredPaginatedMemberDepartments = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberDepartmentPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberDepartmentPaginated, string>({
        queryKey: [
            'member-department',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberDepartmentService.search({
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
