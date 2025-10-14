import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    createMutationInvalidateFn,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IMemberProfile,
    IMemberProfileMembershipInfoRequest,
    IMemberProfilePersonalInfoRequest,
    IMemberProfileQuickCreateRequest,
    IMemberProfileRequest,
} from './member-profile.types'

export const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: memberProfileBaseKey,
} = createDataLayerFactory<IMemberProfile, IMemberProfileRequest>({
    url: '/api/v1/member-profile',
    baseKey: 'member-profile',
})

// ⚙️🛠️ API SERVICE HERE

export const {
    API,
    route: memberProfileAPIRoute,
    create: createMemberProfile,
    updateById: updateMemberProfileById,
    deleteMany: deleteManyMemberProfiles,
    getAll: getAllMemberProfile,
} = apiCrudService

// Update Member Profile Membership Info API
export const updateMemberProfileMembershipInfo = async (
    id: TEntityId,
    data: IMemberProfileMembershipInfoRequest
) => {
    const url = qs.stringifyUrl({
        url: `${memberProfileAPIRoute}/${id}/membership-info`,
    })

    const response = await API.put<
        IMemberProfileMembershipInfoRequest,
        IMemberProfile
    >(url, data)
    return response.data
}

export const getAllPendingMemberProfile = async ({
    query,
}: {
    query?: TAPIQueryOptions
} = {}) =>
    getAllMemberProfile({
        query,
        url: `${memberProfileAPIRoute}/pending`,
    })

export const approveMemberProfile = async (id: TEntityId) => {
    const response = await API.put<void, IMemberProfile>(
        `${memberProfileAPIRoute}/${id}/approve`
    )
    return response.data
}

export const declineMemberProfile = async (id: TEntityId) => {
    const response = await API.put<void, IMemberProfile>(
        `${memberProfileAPIRoute}/${id}/reject`
    )
    return response.data
}

// 🪝 HOOK STARTS HERE
export const {
    useCreate: useCreateMemberProfile,
    useDeleteById: useDeleteMemberProfileById,
    useDeleteMany: useDeleteManyMemberProfiles,
    useGetAll: useGetAllMemberProfiles,
    useGetById: useGetMemberProfileById,
    useGetPaginated: useGetPaginatedMemberProfiles,
    useUpdateById: useUpdateMemberProfileById,
} = apiCrudHooks

// 🪝 Custom Hook for Quick Create Member Profile
export const useQuickCreateMemberProfile = createMutationFactory<
    IMemberProfile,
    Error,
    IMemberProfileQuickCreateRequest
>({
    mutationFn: async (data) => {
        return await createMemberProfile<
            IMemberProfileQuickCreateRequest,
            IMemberProfile
        >({
            url: `${memberProfileAPIRoute}/quick-create`,
            payload: data,
        })
    },
    invalidationFn: (args) =>
        createMutationInvalidateFn(memberProfileBaseKey, args),
})

// 🪝 Custom Hook for Updating Membership Info
export const useUpdateMemberProfileMembershipInfo = createMutationFactory<
    IMemberProfile,
    Error,
    { memberId: TEntityId; data: IMemberProfileMembershipInfoRequest }
>({
    mutationFn: async ({ memberId, data }) =>
        await updateMemberProfileMembershipInfo(memberId, data),
    invalidationFn: (args) =>
        updateMutationInvalidationFn(memberProfileBaseKey, args),
})

// 🪝 Custom Hook for Updating Personal Info
export const useUpdateMemberProfilePersonalInfo = createMutationFactory<
    IMemberProfile,
    Error,
    { memberId: TEntityId; data: IMemberProfilePersonalInfoRequest }
>({
    mutationFn: async ({ memberId, data }) =>
        await updateMemberProfileById({
            id: memberId,
            payload: data,
            targetUrl: `/personal-info`,
        }),
    invalidationFn: (args) =>
        updateMutationInvalidationFn(memberProfileBaseKey, args),
})

export const useApproveMemberProfile = createMutationFactory<
    IMemberProfile,
    Error,
    TEntityId
>({
    mutationFn: (id) => approveMemberProfile(id),
    invalidationFn: (args) => {
        updateMutationInvalidationFn(memberProfileBaseKey, args)
    },
})

export const useDeclineMemberProfile = createMutationFactory<
    IMemberProfile,
    Error,
    TEntityId
>({
    mutationFn: (id) => declineMemberProfile(id),
    invalidationFn: (args) => {
        updateMutationInvalidationFn(memberProfileBaseKey, args)
    },
})

export const useAllPendingMemberProfiles = ({
    query,
    options,
}: {
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberProfile[], Error>
} = {}) => {
    return useQuery<IMemberProfile[], Error>({
        ...options,
        queryKey: [memberProfileBaseKey, 'all', 'pending', query],
        queryFn: async () =>
            getAllPendingMemberProfile({
                query,
            }),
    })
}

export const logger = Logger.getInstance('member-profile')
