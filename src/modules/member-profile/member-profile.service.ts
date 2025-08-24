import { useMutation, useQueryClient } from '@tanstack/react-query'
import qs from 'query-string'

import {
    HookMutationOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import type {
    IMemberProfile,
    IMemberProfileMembershipInfoRequest,
    IMemberProfilePersonalInfoRequest,
    IMemberProfileQuickCreateRequest,
    IMemberProfileRequest,
} from './member-profile.types'

const { apiCrudHooks, apiCrudService, baseQueryKey } = createDataLayerFactory<
    IMemberProfile,
    IMemberProfileRequest
>({
    url: '/api/v1/member-profile',
    baseKey: 'member-profile',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberProfileAPI = apiCrudService

const { API, route } = MemberProfileAPI

// Update Member Profile Membership Info API
export const updateMemberProfileMembershipInfo = async (
    id: TEntityId,
    data: IMemberProfileMembershipInfoRequest
) => {
    const url = qs.stringifyUrl({
        url: `${route}/${id}/membership-info`,
    })

    const response = await API.put<
        IMemberProfileMembershipInfoRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

// Connect Member Profile to User Account
export const connectMemberProfileToUserAccount = async (
    memberProfileId: TEntityId,
    userId: TEntityId
) => {
    const response = await API.put<void, IMemberProfile>(
        `${route}/${memberProfileId}/connect-user-account/${userId}`
    )
    return response.data
}

// Disconenct Member Profile to User Account
export const disconnectMemberProfileUserAccount = async ({
    id,
}: {
    id: TEntityId
}) => {
    const response = await API.put<void, IMemberProfile>(
        `${route}/${id}/disconnect`
    )
    return response.data
}

// 🪝 HOOK STARTS HERE
export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useGetPaginated,
    useUpdateById,
} = apiCrudHooks

// 🪝 Custom Hook for Quick Create Member Profile
export const useQuickCreateMemberProfile = ({
    options,
}: {
    options?: HookMutationOptions<
        IMemberProfile,
        Error,
        IMemberProfileQuickCreateRequest
    >
} = {}) => {
    return useMutation<IMemberProfile, Error, IMemberProfileQuickCreateRequest>(
        {
            ...options,
            meta: options?.meta
                ? options.meta
                : {
                      invalidates: [
                          [baseQueryKey, 'paginated'],
                          [baseQueryKey, 'all'],
                      ],
                  },
            mutationFn: async (data) => {
                const fullName = `${data.first_name ?? ''} ${data.middle_name ?? ''} ${data.last_name ?? ''} ${data.suffix ?? ''}`
                return await MemberProfileAPI.create<
                    IMemberProfileQuickCreateRequest,
                    IMemberProfile
                >({
                    url: `${route}/quick-create`,
                    payload: {
                        ...data,
                        full_name: fullName,
                    },
                })
            },
        }
    )
}

// 🪝 Custom Hook for Updating Membership Info
export const useUpdateMemberProfileMembershipInfo = ({
    options,
}: {
    options?: HookMutationOptions<
        IMemberProfile,
        Error,
        { memberId: TEntityId; data: IMemberProfileMembershipInfoRequest }
    >
} = {}) => {
    const queryClient = useQueryClient()
    return useMutation<
        IMemberProfile,
        Error,
        { memberId: TEntityId; data: IMemberProfileMembershipInfoRequest }
    >({
        ...options,
        mutationFn: async ({ memberId, data }) =>
            await updateMemberProfileMembershipInfo(memberId, data),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: [baseQueryKey, variables.memberId],
            })
            queryClient.invalidateQueries({
                queryKey: [baseQueryKey, 'member-profile', variables.memberId],
            })
            options?.onSuccess?.(data, variables, context)
        },
    })
}

// 🪝 Custom Hook for Updating Personal Info
export const useUpdateMemberProfilePersonalInfo = ({
    options,
}: {
    options?: HookMutationOptions<
        IMemberProfile,
        Error,
        { memberId: TEntityId; data: IMemberProfilePersonalInfoRequest }
    >
} = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberProfile,
        Error,
        { memberId: TEntityId; data: IMemberProfilePersonalInfoRequest }
    >({
        ...options,
        mutationFn: async ({ memberId, data }) =>
            await MemberProfileAPI.updateById({
                id: memberId,
                payload: data,
                targetUrl: `/personal-info`,
            }),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: [baseQueryKey, variables.memberId],
            })
            queryClient.invalidateQueries({
                queryKey: [baseQueryKey, 'member-profile', variables.memberId],
            })
            options?.onSuccess?.(data, variables, context)
        },
    })
}

// 🪝 Custom Hook for Connecting Member Profile to User Account
export const useConnectMemberProfileToUserAccount = ({
    options,
}: {
    options?: HookMutationOptions<
        IMemberProfile,
        string,
        { memberProfileId: TEntityId; userId: TEntityId }
    >
} = {}) => {
    return useMutation<
        IMemberProfile,
        string,
        { memberProfileId: TEntityId; userId: TEntityId }
    >({
        ...options,
        mutationFn: async ({ memberProfileId, userId }) =>
            await connectMemberProfileToUserAccount(memberProfileId, userId),
        onSuccess: (data, variables, context) => {
            options?.onSuccess?.(data, variables, context)
        },
    })
}

// 🪝 Custom Hook for disconnecting Member Profile User Account
export const useDisconnectMemberProfileUserAccount = ({
    options,
}: {
    options?: HookMutationOptions<IMemberProfile, string, TEntityId>
} = {}) => {
    return useMutation<IMemberProfile, string, TEntityId>({
        ...options,
        mutationFn: async (id) =>
            await disconnectMemberProfileUserAccount({ id }),
        onSuccess: (data, variables, context) => {
            options?.onSuccess?.(data, variables, context)
        },
    })
}
