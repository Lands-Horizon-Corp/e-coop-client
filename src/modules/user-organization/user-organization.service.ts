import {
    UseMutationOptions,
    useMutation,
    useQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { groupBy, withCatchAsync } from '@/helpers/function-utils'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import { IBranch, getBranchesByOrganizationId } from '../branch'
import { IUserBase } from '../user/user.types'
import {
    IOrgUserOrganizationGroup,
    IUserOrganization,
    IUserOrganizationPaginated,
    IUserOrganizationPermissionRequest,
    IUserOrganizationSettingsRequest,
} from './user-organization.types'

export const { apiCrudHooks, apiCrudService, baseQueryKey } =
    createDataLayerFactory<IUserOrganization, void>({
        url: '/api/v1/user-organization',
        baseKey: 'user-organization',
    })
export const { useGetAll, useGetById, useDeleteById, useUpdateById } =
    apiCrudHooks

export const {
    API,
    route: userOrganizationAPIRoute,
    create: createUserOrganization,
    deleteById: deleteUserOrganizationById,
    deleteMany: deleteManyUserOrganization,
    getAll: getAllUserOrganization,
    getById: getUserOrganizationById,
    getPaginated: getPaginatedUserOrganization,
    updateById: updateUserOrganizationById,
} = apiCrudService

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
    const endpoint = `${userOrganizationAPIRoute}/user/${userId}`
    return groupByOrganization(
        (await API.get<IUserOrganization<IUserBase>[]>(endpoint)).data
    )
}

export const getCurrentUserOrganizations = async () => {
    const endpoint = `${userOrganizationAPIRoute}/current`
    return groupByOrganization(
        (await API.get<IUserOrganization<IUserBase>[]>(endpoint)).data
    )
}

export const getAllUserOrganizations = async () => {
    return (await API.get<IUserOrganization[]>(userOrganizationAPIRoute)).data
}

export const joinOrganization = async (
    organizationId: TEntityId,
    branchId: TEntityId
) => {
    const endpoint = `${userOrganizationAPIRoute}/organization/${organizationId}/branch/${branchId}/join`
    return (await API.post<IUserOrganization, IUserOrganization>(endpoint)).data
}

export const joinWithInvitationCode = async (code: string) => {
    const endpoint = `${userOrganizationAPIRoute}/invitation-code/${code}/join`
    return (await API.post<IUserOrganization, IUserOrganization>(endpoint)).data
}

export const canJoinOrganizationMember = async (
    organizationId: TEntityId,
    branchId: TEntityId
): Promise<boolean> => {
    const endpoint = `${userOrganizationAPIRoute}/organization/${organizationId}/branch/${branchId}/can-join-employee`
    try {
        const response = await API.get(endpoint)
        return response.status === 200
    } catch {
        return false
    }
}

export const seedOrganization = async (organizationId: TEntityId) => {
    const endpoint = `${userOrganizationAPIRoute}/${organizationId}/seed`
    const response = await API.post(endpoint)
    return response.status === 200
}

export const switchOrganization = async (userOrganizationId: TEntityId) => {
    const endpoint = `${userOrganizationAPIRoute}/${userOrganizationId}/switch`
    try {
        const response = await API.get(endpoint)
        return response.status === 200
    } catch {
        return false
    }
}

export const getAllJoinRequests = async () => {
    const endpoint = `${userOrganizationAPIRoute}/join-request`
    return (await API.get<IUserOrganization[]>(endpoint)).data
}

export const acceptJoinRequest = async (userOrganizationId: TEntityId) => {
    const endpoint = `${userOrganizationAPIRoute}/${userOrganizationId}/accept`
    return (await API.post<void, IUserOrganization>(endpoint)).data
}

export const rejectJoinRequest = async (userOrganizationId: TEntityId) => {
    const endpoint = `${userOrganizationAPIRoute}/${userOrganizationId}/reject`
    return (await API.delete<IUserOrganization>(endpoint)).data
}

export const updateUserOrganizationPermission = async (
    userOrgId: TEntityId,
    data: IUserOrganizationPermissionRequest
) => {
    const response = await API.put<
        IUserOrganizationPermissionRequest,
        IUserOrganization
    >(`${userOrganizationAPIRoute}/${userOrgId}/permission`, data)
    return response.data
}

export const updateUserOrganizationSettings = async ({
    id,
    url,
    data,
}: {
    id?: TEntityId
    url?: string
    data: IUserOrganizationSettingsRequest
}) => {
    const response = await API.put<
        IUserOrganizationSettingsRequest,
        IUserOrganization
    >(
        url ??
            (id
                ? `${userOrganizationAPIRoute}/settings/${id}`
                : `${userOrganizationAPIRoute}/settings/current`),
        data
    )
    return response.data
}

export const { useGetById: useUserOrganizationById } = apiCrudHooks

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
        mutationFn: async (organizationId) => {
            const [error, result] = await withCatchAsync(
                seedOrganization(organizationId)
            )
            if (error) {
                toast.error(error.message)
                throw error
            }
            return result
        },
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

export const useJoinWithInvitationCode = ({
    options,
}: {
    options?: UseMutationOptions<IUserOrganization, Error, string>
}) => {
    return useMutation<IUserOrganization, Error, string>({
        mutationKey: ['user-organization', 'join-with-code'],
        mutationFn: (code) => joinWithInvitationCode(code),
        ...options,
    })
}

export type TUserOrganizationHookMode =
    | 'all' // all user organizations
    | 'none-member-profile'

export const useFilteredPaginatedUserOrganization = ({
    mode = 'all',
    userOrgId,
    memberProfileId,
    query,
    options,
}: {
    mode?: TUserOrganizationHookMode
    userOrgId?: TEntityId
    memberProfileId?: TEntityId
    query?: Record<string, unknown>
    options?: HookQueryOptions<IUserOrganizationPaginated, Error>
}) => {
    return useQuery<IUserOrganizationPaginated, Error>({
        ...options,
        queryKey: [
            'user-organization',
            'filtered-paginated',
            mode,
            userOrgId,
            memberProfileId,
            query,
        ],
        queryFn: async () => {
            let url = '/api/v1/user-organization/search'

            if (mode === 'none-member-profile')
                url = '/api/v1/user-organization/none-member-profile/search'

            return apiCrudService.getPaginated({
                url,
                query,
            })
        },
    })
}

export const useUserOrgJoinRequests = ({
    query,
    options,
}: {
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IUserOrganization[], Error>
} = {}) => {
    return useQuery<IUserOrganization[], Error>({
        ...options,
        queryKey: [baseQueryKey, 'join-request', 'all', query],
        queryFn: async () => getAllJoinRequests(),
    })
}

export const useUserOrgAcceptJoinRequest = createMutationFactory<
    IUserOrganization,
    Error,
    TEntityId
>({
    mutationFn: (id) => acceptJoinRequest(id),
})

export const useUserOrgRejectJoinRequest = createMutationFactory<
    IUserOrganization,
    Error,
    TEntityId
>({
    mutationFn: (id) => rejectJoinRequest(id),
    invalidationFn: (args) => updateMutationInvalidationFn(baseQueryKey, args),
})

export const useUpdateUserOrganizationPermission = createMutationFactory<
    IUserOrganization,
    Error,
    { id: TEntityId; data: IUserOrganizationPermissionRequest }
>({
    mutationFn: ({ id, data }) => updateUserOrganizationPermission(id, data),
    invalidationFn: (args) => {
        updateMutationInvalidationFn(baseQueryKey, args)

        // special ocasion since both of them need each other, I hardcoded this here
        // instead of importing employee service base key because it will circular depndency
        updateMutationInvalidationFn('employee', args)
    },
})

export const useUpdateUserOrganizationSettings = createMutationFactory<
    IUserOrganization,
    Error,
    { id?: TEntityId; url?: string; data: IUserOrganizationSettingsRequest }
>({
    mutationFn: (args) => updateUserOrganizationSettings(args),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['employee', 'paginated'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['user-organization', args.resultData.id],
        })
        updateMutationInvalidationFn('user-organization', args)
    },
})
