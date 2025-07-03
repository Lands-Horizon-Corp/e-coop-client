import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { BranchService } from '@/api-service/branch-services'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import { IAPIHook, IBranch, IBranchRequest, TEntityId } from '@/types'

export const useCreateBranchByOrg = ({
    onError,
    onSuccess,
}: IAPIHook<IBranch, string>) => {
    const queryClient = useQueryClient()

    return useMutation<
        IBranch,
        string,
        { organizationId: TEntityId; data: IBranchRequest }
    >({
        mutationFn: async ({ organizationId, data }) => {
            const [error, response] = await withCatchAsync(
                BranchService.createBranchByOrgId(data, organizationId)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onError?.(error.message)

                toast.error(errorMessage)
                throw errorMessage
            }
            onSuccess?.(response)
            queryClient.invalidateQueries({
                queryKey: [
                    'branches-by-user-organization_id',
                    'branch-resource-by-user-organization-id',
                ],
            })
            return response
        },
    })
}

export const useUpdateBranch = ({
    onError,
    onSuccess,
}: IAPIHook<IBranch, string>) => {
    const queryClient = useQueryClient()

    return useMutation<
        IBranch,
        string,
        { id: TEntityId; data: IBranchRequest }
    >({
        mutationFn: async ({ id, data }) => {
            const [error, response] = await withCatchAsync(
                BranchService.updateBranch(id, data)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onError?.(error.message)
                toast.error(errorMessage)
                throw errorMessage
            }
            onSuccess?.(response)
            queryClient.invalidateQueries({
                queryKey: [
                    'branches-by-user-organization_id',
                    'branch-resource-by-user-organization-id',
                ],
            })
            return response
        },
    })
}

export const useGetBranchesByOrganizationId = (
    userOrganizationId: TEntityId
) => {
    return useQuery<IBranch[], string>({
        queryKey: [
            'branches-by-user-organization_id',
            'branch-resource-by-user-organization-id',
        ],
        queryFn: async () => {
            const [error, response] = await withCatchAsync(
                BranchService.getBranchesByOrganizationId(userOrganizationId)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }
            return response
        },
        enabled: !!userOrganizationId,
    })
}

export const useGetAllBranches = () => {
    return useQuery<IBranch[], string>({
        queryKey: ['branch', 'all'],
        queryFn: async () => {
            const [error, response] = await withCatchAsync(
                BranchService.getAllBranches()
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }
            return response
        },
        initialData: [],
        retry: 1,
    })
}

export const useGetBranchesById = (id: string) => {
    return useQuery<IBranch, string>({
        queryKey: ['branch', 'id'],
        queryFn: async () => {
            const [error, response] = await withCatchAsync(
                BranchService.getBranchesById(id)
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

export const useDeleteBranch = ({ onSuccess }: IAPIHook<unknown, string>) => {
    const queryClient = useQueryClient()

    return useMutation<unknown, string, TEntityId>({
        mutationFn: async (branchId) => {
            const [error, result] = await withCatchAsync(
                BranchService.deleteBranch(branchId)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }
            onSuccess?.(result)
            queryClient.invalidateQueries({
                queryKey: [
                    'branches-by-user-organization_id',
                    'branch-resource-by-user-organization-id',
                ],
            })
            return result
        },
    })
}
