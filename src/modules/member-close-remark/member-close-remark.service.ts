import { useMutation } from '@tanstack/react-query'

import {
    HookMutationOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import { MemberProfileAPI } from '../member-profile/member-profile.service'
import type { IMemberProfile } from '../member-profile/member-profile.types'
import type {
    IMemberCloseRemark,
    IMemberCloseRemarkRequest,
} from './member-close-remark.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberCloseRemark,
    IMemberCloseRemarkRequest
>({
    url: '/api/v1/member-close-remark',
    baseKey: 'member-close-remark',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberCloseRemarkAPI = apiCrudService

// Close Member Profile Account API
export const closeMemberProfileAccount = async (
    id: TEntityId,
    closeRemark: IMemberCloseRemarkRequest[]
) => {
    return await MemberProfileAPI.updateById<
        IMemberProfile,
        IMemberCloseRemarkRequest[]
    >({
        id,
        payload: closeRemark,
        targetUrl: `/close`,
    })
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

// Custom Hook for Closing Member Profile
export const useCloseMemberProfile = ({
    options,
}: {
    options?: HookMutationOptions<
        IMemberProfile,
        Error,
        { profileId: TEntityId; data: IMemberCloseRemarkRequest[] }
    >
} = {}) => {
    return useMutation<
        IMemberProfile,
        Error,
        { profileId: TEntityId; data: IMemberCloseRemarkRequest[] }
    >({
        ...options,
        meta: {
            invalidates: [['member-profile']],
        },
        mutationFn: async ({ profileId, data }) =>
            await closeMemberProfileAccount(profileId, data),
    })
}
