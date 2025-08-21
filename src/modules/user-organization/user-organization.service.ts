import {
    UseMutationOptions,
    useMutation,
    useQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { groupBy, withCatchAsync } from '@/helpers/function-utils'
import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import { IBranch, getBranchesByOrganizationId } from '../branch'
import { IOrganizationWithPolicies } from '../organization'
import { IUserBase } from '../user/user.types'
import {
    IOrgUserOrganizationGroup,
    IUserOrganization,
} from './user-organization.types'

const { apiCrudHooks } = createDataLayerFactory<IUserOrganization, void>({
    url: '/api/v1/user-organization',
    baseKey: 'user-organization',
})
export const { useGetAll, useGetById, useDeleteById, useUpdateById } =
    apiCrudHooks

const { API, route } = createAPIRepository('/api/v1/user-organization')

const groupByOrganization = (result: IUserOrganization<IUserBase>[]) => {
    const grouped = groupBy(result, (item) => item.organization_id)

    return Object.keys(grouped).reduce<IOrgUserOrganizationGroup[]>(
        (acc, orgKey) => {
            const userOrgs = grouped[orgKey]
            const userOrganization = userOrgs?.[0]

            acc.push({
                ...userOrganization.organization,
                user_organizations: userOrgs,
            })

            return acc
        },
        []
    )
}

export const getUserOrganizationUserById = async (userId: TEntityId) => {
    const endpoint = `${route}/user/${userId}`
    return groupByOrganization(
        (await API.get<IUserOrganization<IUserBase>[]>(endpoint)).data
    )
}

export const getCurrentUserOrganizations = async () => {
    const endpoint = `${route}/current`
    return groupByOrganization(
        (await API.get<IUserOrganization<IUserBase>[]>(endpoint)).data
    )
}

export const getAllUserOrganizations = async () => {
    return (await API.get<IUserOrganization[]>(route)).data
}

export const joinOrganization = async (
    organizationId: TEntityId,
    branchId: TEntityId
) => {
    const endpoint = `${route}/organization/${organizationId}/branch/${branchId}/join`
    return (await API.post<IUserOrganization, IUserOrganization>(endpoint)).data
}

export const joinWithInvitationCode = async (code: string) => {
    const endpoint = `${route}/invitation-code/${code}/join`
    return (await API.post<IUserOrganization, IUserOrganization>(endpoint)).data
}

export const canJoinOrganizationMember = async (
    organizationId: TEntityId,
    branchId: TEntityId
): Promise<boolean> => {
    const endpoint = `${route}/organization/${organizationId}/branch/${branchId}/can-join-employee`
    try {
        const response = await API.get(endpoint)
        return response.status === 200
    } catch {
        return false
    }
}

export const seedOrganization = async (organizationId: TEntityId) => {
    const endpoint = `${route}/${organizationId}/seed`
    const response = await API.post(endpoint)
    return response.status === 200
}

export const switchOrganization = async (userOrganizationId: TEntityId) => {
    const endpoint = `${route}/${userOrganizationId}/switch`
    try {
        const response = await API.get(endpoint)
        return response.status === 200
    } catch {
        return false
    }
}

export const getAllJoinRequests = async () => {
    const endpoint = `${route}/join-request`
    return (await API.get<IUserOrganization[]>(endpoint)).data
}

export const acceptJoinRequest = async (userOrganizationId: TEntityId) => {
    const endpoint = `${route}/${userOrganizationId}/accept`
    return (await API.post<void, IUserOrganization>(endpoint)).data
}

export const rejectJoinRequest = async (userOrganizationId: TEntityId) => {
    const endpoint = `${route}/${userOrganizationId}/reject`
    return (await API.delete<IUserOrganization>(endpoint)).data
}

//hooks
interface Options<TData = IOrgUserOrganizationGroup[]> {
    options?: HookQueryOptions<TData>
}

export const useGetUserOrganizationByUserId = ({
    options,
    userId,
}: Options & { userId: TEntityId }) => {
    return useQuery<IOrgUserOrganizationGroup[]>({
        queryKey: ['user-organization', 'current', userId],
        queryFn: () => getUserOrganizationUserById(userId),
        ...options,
        enabled: !!userId && (options?.enabled ?? true),
    })
}

export const useGetCurrentUserOrganizations = ({ options }: Options = {}) => {
    return useQuery<IOrgUserOrganizationGroup[]>({
        queryKey: ['user-organization', 'current'],
        queryFn: getCurrentUserOrganizations,
        ...options,
    })
}

export const useSwitchOrganization = () => {
    return useMutation<boolean, string, TEntityId>({
        mutationKey: ['user-organization', 'switch'],
        mutationFn: switchOrganization,
    })
}

export const useSeedOrganization = () => {
    return useMutation<boolean, string, TEntityId>({
        mutationKey: ['user-organization', 'seed'],
        mutationFn: seedOrganization,
    })
}

export const useUserOrgJoinRequest = () => {
    return useMutation<IUserOrganization[], string, TEntityId>({
        mutationKey: ['user-organization', 'join-request'],
        mutationFn: getAllJoinRequests,
    })
}
interface Options<TData = IOrgUserOrganizationGroup[]> {
    options?: HookQueryOptions<TData>
}

export const useJoinOrganization = (
    options?: UseMutationOptions<
        IUserOrganization,
        Error,
        { organizationId: TEntityId; branchId: TEntityId }
    >
) => {
    return useMutation<
        IUserOrganization,
        Error,
        { organizationId: TEntityId; branchId: TEntityId }
    >({
        mutationKey: ['user-organization', 'join'],
        mutationFn: ({ organizationId, branchId }) =>
            joinOrganization(organizationId, branchId),
        ...options,
    })
}

export const useCanJoinMember = ({
    organizationId,
    options,
}: {
    organizationId: TEntityId
    options?: HookQueryOptions<
        { branch: IBranch; isUserCanJoin: boolean }[],
        Error
    >
}) => {
    return useQuery<{ branch: IBranch; isUserCanJoin: boolean }[], Error>({
        ...options,
        queryKey: ['user-organization', 'can-join'],
        queryFn: async () => {
            const branches = await getBranchesByOrganizationId(organizationId)
            const [error, results] = await withCatchAsync(
                Promise.all(
                    branches.map(async (branch) => {
                        const isUserCanJoin = await canJoinOrganizationMember(
                            organizationId,
                            branch.id
                        )
                        return { branch, isUserCanJoin }
                    })
                )
            )
            if (error) {
                toast.error(error.message)
                return []
            }
            return results ?? []
        },
    })
}
