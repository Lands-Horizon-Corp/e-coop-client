import { useMutation, useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import { IUserOrganization } from '../user-organization'
import { IBranch, IBranchRequest } from './branch.types'

/**
 * CRUD Factory
 */
const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IBranch,
    IBranchRequest
>({
    url: '/api/v1/branch',
    baseKey: 'branch',
})

const { route, API } = apiCrudService

export const {
    useGetAll: useGetAllBranches,
    useGetById: useGetBranchById,
    useDeleteById: useDeleteBranch,
    useUpdateById: useUpdateBranch,
} = apiCrudHooks

export const getBranchesByOrganizationId = async (
    organizationId: TEntityId
) => {
    const endpoint = `${route}/organization/${organizationId}`
    return (await API.get<IBranch[]>(endpoint)).data
}

export const postBranchByOrganizationId = async (
    userOrganizationId: TEntityId
) => {
    const endpoint = `${route}/user-organization/${userOrganizationId}`
    return (await API.post<IUserOrganization, IUserOrganization>(endpoint)).data
}

/**
 * Hooks
 */
interface QueryOptions<TData = IBranch[]> {
    options?: HookQueryOptions<TData>
}

export const useCreateBranchByOrganizationId = createMutationFactory<
    IBranch,
    Error,
    { organizationId: TEntityId; payload: IBranchRequest }
>({
    mutationFn: async ({ organizationId, payload }) => {
        const endpoint = `${route}/organization/${organizationId}`
        return (await API.post<IBranchRequest, IBranch>(endpoint, payload)).data
    },
})

export const useGetBranchesByOrganizationId = ({
    organizationId,
    options,
}: { organizationId: TEntityId } & QueryOptions<IBranch[]>) => {
    return useQuery<IBranch[]>({
        queryKey: ['get-branches-by-organization-id', organizationId],
        queryFn: () => getBranchesByOrganizationId(organizationId),
        ...options,
        enabled: !!organizationId && (options?.enabled ?? true),
    })
}

export const usePostBranchByOrganizationId = () => {
    return useMutation<IUserOrganization, string, TEntityId>({
        mutationKey: ['branch', 'post-by-org'],
        mutationFn: postBranchByOrganizationId,
    })
}
