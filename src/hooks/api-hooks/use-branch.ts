import { BranchService } from '@/api-service/branch-services'
import { serverRequestErrExtractor } from '@/helpers'
import { IAPIHook, IBranch, IBranchRequest, TEntityId } from '@/types'
import { withCatchAsync } from '@/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateBranch = (
    { onError, onSuccess }: IAPIHook<IBranch, string>,
    userOrganizationId: TEntityId
) => {
    const queryClient = useQueryClient()

    return useMutation<IBranch, string, IBranchRequest>({
        mutationKey: ['create-request', 'create'],
        mutationFn: async (branchData) => {
            const [error, response] = await withCatchAsync(
                BranchService.createBranch(branchData, userOrganizationId)
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

export const useUpdateBranch = (
    { onError, onSuccess }: IAPIHook<unknown, string>,
    userOrganizationId: TEntityId
) => {
    const queryClient = useQueryClient()

    return useMutation<unknown, string, IBranchRequest>({
        mutationKey: ['update-branch', 'update'],
        mutationFn: async (branchData) => {
            const [error, response] = await withCatchAsync(
                BranchService.updateBranch(branchData, userOrganizationId)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onError?.(error.message)
                console.log('error', error)
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
    })
}

export const usegetAllBranches = () => {
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

    return useMutation<
        unknown,
        string,
        { branchId: TEntityId; userOrganizationId: TEntityId }
    >({
        mutationKey: ['delete-branch-with-user-org-id'],
        mutationFn: async ({ branchId, userOrganizationId }) => {
            const [error, result] = await withCatchAsync(
                BranchService.deleteBranch(branchId, userOrganizationId)
            )
            if (error) {
                console.log('error', error)
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
