import { useMutation, useQuery } from '@tanstack/react-query'

import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import { IUserOrganization } from '../user-organization'
import { IBranch, IBranchRequest } from './branch.types'

/**
 * CRUD Factory
 */
const { apiCrudHooks } = createDataLayerFactory<IBranch, IBranchRequest>({
    url: '/api/v1/branch',
    baseKey: 'branch',
})

export const {
    useGetAll: useGetAllBranches,
    useGetById: useGetBranchById,
    useDeleteById: useDeleteBranch,
    useUpdateById: useUpdateBranch,
} = apiCrudHooks

/**
 * Repository
 */
const { API, route } = createAPIRepository('/api/v1/branch')

export const createBranchByOrgId = async (
    organizationId: TEntityId,
    branchData: IBranchRequest
) => {
    const endpoint = `${route}/organization/${organizationId}`
    return (await API.post<IBranchRequest, IBranch>(endpoint, branchData)).data
}

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
interface Options<TData = IBranch[]> {
    options?: HookQueryOptions<TData>
}

export const useGetBranchesByOrganizationId = ({
    organizationId,
    options,
}: { organizationId: TEntityId } & Options<IBranch[]>) => {
    return useQuery<IBranch[]>({
        queryKey: ['branch', 'organization', organizationId],
        queryFn: () => getBranchesByOrganizationId(organizationId),
        ...options,
        enabled: !!organizationId && (options?.enabled ?? true),
    })
}

export const useCreateBranchByOrgId = () => {
    return useMutation<
        IBranch,
        Error,
        {
            organizationId: TEntityId
            branchData: IBranchRequest
        }
    >({
        mutationKey: ['branch', 'create-by-org'],
        mutationFn: ({ organizationId, branchData }) =>
            createBranchByOrgId(organizationId, branchData),
    })
}

export const usePostBranchByOrganizationId = () => {
    return useMutation<IUserOrganization, string, TEntityId>({
        mutationKey: ['branch', 'post-by-org'],
        mutationFn: postBranchByOrganizationId,
    })
}
