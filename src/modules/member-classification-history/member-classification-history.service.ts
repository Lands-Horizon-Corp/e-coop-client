import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IMemberClassificationHistory,
    IMemberClassificationHistoryPaginated,
} from './member-classification-history.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberClassificationHistory,
    void
>({
    url: '/api/v1/member-classification-history',
    baseKey: 'member-classification-history',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberClassificationHistoryAPI = apiCrudService

const { API, route } = MemberClassificationHistoryAPI

// Custom API for fetching Member Classification History by Profile ID
export const getMemberClassificationHistoryById = async ({
    profileId,
    query,
}: {
    profileId: TEntityId
    query?: {
        sort?: string
        filters?: string
        pageIndex?: number
        pageSize?: number
    }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `${route}/member-profile/${profileId}/search`,
            query,
        },
        { skipNull: true }
    )

    const response = await API.get<IMemberClassificationHistoryPaginated>(url)
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

// 🪝 Custom Hook for Fetching Member Classification History
export const useMemberClassificationHistory = ({
    profileId,
    query,
    options,
}: {
    profileId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberClassificationHistoryPaginated, Error>
}) => {
    return useQuery<IMemberClassificationHistoryPaginated, Error>({
        ...options,
        queryKey: [
            'member-classification-history',
            'member-profile',
            profileId,
            'paginated',
            query,
        ],
        queryFn: () => getMemberClassificationHistoryById({ profileId, query }),
    })
}
