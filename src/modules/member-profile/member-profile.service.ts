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

import { TUserLocation } from '../area'
import type {
    IMemberProfile,
    IMemberProfileDashboardSummaryResponse,
    IMemberProfileMembershipInfoRequest,
    IMemberProfilePaginated,
    IMemberProfilePersonalInfoRequest,
    IMemberProfileQuickCreateRequest,
    IMemberProfileQuickSearchResponse,
    IMemberProfileRequest,
} from './member-profile.types'
import { TMemberProfileCoordinatesSchema } from './member-profile.validation'

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
    getPaginated: getPaginatedMemberProfile,
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
export const getMemberProfileDashboardSummary = async () => {
    return (
        await API.get<IMemberProfileDashboardSummaryResponse>(
            `${memberProfileAPIRoute}/summary`
        )
    ).data
}

export const getMemberProfileQuickSearch = async (search: string) => {
    const url = qs.stringifyUrl({
        url: `${memberProfileAPIRoute}/quick/search`,
        query: { search },
    })
    const response = await API.get<IMemberProfileQuickSearchResponse[]>(url)
    return response.data
}

export const useGetPendingMemberProfiles = ({
    query,
    options,
}: {
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberProfile[], Error>
} = {}) => {
    return useQuery<IMemberProfile[], Error>({
        queryKey: [memberProfileBaseKey, 'pending', query].filter(Boolean),

        queryFn: () =>
            getAllPendingMemberProfile({
                query,
            }),

        staleTime: 1000 * 60, // 1 minute cache
        ...options,
    })
}

export const {
    useCreate: useCreateMemberProfile,
    useDeleteById: useDeleteMemberProfileById,
    useDeleteMany: useDeleteManyMemberProfiles,
    useGetAll: useGetAllMemberProfiles,
    useGetById: useGetMemberProfileById,
    useGetPaginated: useGetPaginatedMemberProfiles,
    useUpdateById: useUpdateMemberProfileById,
} = apiCrudHooks

export const useMemberProfileCoordinates = createMutationFactory<
    IMemberProfile,
    Error,
    { memberId: TEntityId; data: TMemberProfileCoordinatesSchema }
>({
    mutationFn: async ({ memberId, data }) =>
        await updateMemberProfileById({
            id: memberId,
            payload: data,
            targetUrl: `/coordinates`,
        }),
    invalidationFn: (args) =>
        updateMutationInvalidationFn(memberProfileBaseKey, args),
})

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
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: ['auth'],
        })
        createMutationInvalidateFn(memberProfileBaseKey, args)
    },
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
        args.queryClient.invalidateQueries({
            queryKey: [memberProfileBaseKey, 'all', 'pending'],
        })
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
        args.queryClient.invalidateQueries({
            queryKey: [memberProfileBaseKey, 'all', 'pending'],
        })
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

export const useGetPaginatedMemberProfileByMemberType = ({
    memberTypeId,
    query,
    options,
}: {
    memberTypeId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberProfilePaginated, Error>
}) => {
    return useQuery<IMemberProfilePaginated, Error>({
        ...options,
        queryKey: [
            memberProfileBaseKey,
            'paginated',
            'member-type',
            memberTypeId,
            query,
        ].filter(Boolean),
        queryFn: async () =>
            getPaginatedMemberProfile({
                url: `${memberProfileAPIRoute}/member-type/${memberTypeId}/search`,
                query,
            }),
    })
}

export const useGetMemberDashboardSummary = ({
    options,
}: {
    options: HookQueryOptions<IMemberProfileDashboardSummaryResponse, Error>
}) => {
    return useQuery<IMemberProfileDashboardSummaryResponse, Error>({
        queryKey: [memberProfileBaseKey, 'member-profile-summary'],
        queryFn: getMemberProfileDashboardSummary,
        ...options,
    })
}

export const useLinkMemberProfileMemberType = createMutationFactory<
    IMemberProfile,
    Error,
    { memberId: TEntityId; memberTypeId: TEntityId }
>({
    mutationFn: async ({ memberId, memberTypeId }) => {
        const response = await API.put<void, IMemberProfile>(
            `${memberProfileAPIRoute}/${memberId}/member-type/${memberTypeId}/link`
        )
        return response.data
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [
                memberProfileBaseKey,
                'paginated',
                'member-type',
                args.variables.memberTypeId,
            ],
        })
        updateMutationInvalidationFn(memberProfileBaseKey, args)
    },
})

export const useUnlinkMemberProfileMemberType = createMutationFactory<
    IMemberProfile,
    Error,
    { memberId: TEntityId }
>({
    mutationFn: async ({ memberId }) => {
        const response = await API.put<void, IMemberProfile>(
            `${memberProfileAPIRoute}/${memberId}/unlink`
        )
        return response.data
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [memberProfileBaseKey, 'paginated', 'member-type'],
        })
        updateMutationInvalidationFn(memberProfileBaseKey, args)
    },
})

export const useGetMemberProfile = createMutationFactory<
    IMemberProfile,
    Error,
    TEntityId
>({
    mutationFn: async (id) => {
        const response = await API.get<IMemberProfile>(
            `${memberProfileAPIRoute}/${id}`
        )
        return response.data
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [memberProfileBaseKey, 'by-id', args.variables],
        })
    },
})

export const useGetMemberProfileQuickSearch = ({
    search,
    options,
}: {
    search: string
    options?: HookQueryOptions<IMemberProfileQuickSearchResponse[], Error>
}) => {
    return useQuery<IMemberProfileQuickSearchResponse[], Error>({
        queryKey: [memberProfileBaseKey, 'quick-search', search],
        queryFn: () => getMemberProfileQuickSearch(search),
        enabled: search.length >= 2,
        staleTime: 1000 * 30,
        ...options,
    })
}

export const getMemberByAreaId = async (areaId: TEntityId) => {
    const url = qs.stringifyUrl({
        url: `${memberProfileAPIRoute}/area/${areaId}`,
    })
    const response = await API.get<TUserLocation[]>(url)
    return response.data
}

export const useGetMemberProfileByAreaId = ({
    areaId,
    options,
}: {
    areaId: TEntityId
    options?: HookQueryOptions<TUserLocation[], Error>
}) => {
    return useQuery<TUserLocation[], Error>({
        queryKey: [memberProfileBaseKey, 'area'],
        queryFn: () => getMemberByAreaId(areaId),
        enabled: !!areaId,
        ...options,
    })
}

export const logger = Logger.getInstance('member-profile')
