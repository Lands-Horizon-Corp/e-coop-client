import qs from 'query-string'

import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    createMutationInvalidateFn,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    IMemberProfile,
    IMemberProfileMembershipInfoRequest,
    IMemberProfilePersonalInfoRequest,
    IMemberProfileQuickCreateRequest,
    IMemberProfileRequest,
} from './member-profile.types'

export const { apiCrudHooks, apiCrudService, baseQueryKey } = createDataLayerFactory<
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
export const useQuickCreateMemberProfile = createMutationFactory<
    IMemberProfile,
    Error,
    IMemberProfileQuickCreateRequest
>({
    mutationFn: async (data) => {
        return await MemberProfileAPI.create<
            IMemberProfileQuickCreateRequest,
            IMemberProfile
        >({
            url: `${route}/quick-create`,
            payload: data,
        })
    },
    invalidationFn: (args) => createMutationInvalidateFn(baseQueryKey, args),
})

// 🪝 Custom Hook for Updating Membership Info
export const useUpdateMemberProfileMembershipInfo = createMutationFactory<
    IMemberProfile,
    Error,
    { memberId: TEntityId; data: IMemberProfileMembershipInfoRequest }
>({
    mutationFn: async ({ memberId, data }) =>
        await updateMemberProfileMembershipInfo(memberId, data),
    invalidationFn: (args) => updateMutationInvalidationFn(baseQueryKey, args),
})

// 🪝 Custom Hook for Updating Personal Info
export const useUpdateMemberProfilePersonalInfo = createMutationFactory<
    IMemberProfile,
    Error,
    { memberId: TEntityId; data: IMemberProfilePersonalInfoRequest }
>({
    mutationFn: async ({ memberId, data }) =>
        await MemberProfileAPI.updateById({
            id: memberId,
            payload: data,
            targetUrl: `/personal-info`,
        }),
    invalidationFn: (args) => updateMutationInvalidationFn(baseQueryKey, args),
})
