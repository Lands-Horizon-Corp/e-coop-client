import { useMutation } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { HookMutationOptions } from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import { memberProfileAPIRoute } from '../member-profile/member-profile.service'
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
export const { API } = apiCrudService

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
        mutationFn: async ({ profileId, data }) => {
            const response = await API.post<
                IMemberCloseRemarkRequest[],
                IMemberProfile
            >(`${memberProfileAPIRoute}/${profileId}/close`, data)
            return response.data
        },
    })
}

export const logger = Logger.getInstance('member-close-remark')
