import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IMemberCenterHistory,
    IMemberCenterHistoryPaginated,
} from './member-center-history.types'

const { baseQueryKey, apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberCenterHistory,
    void
>({
    url: '/api/v1/member-center-history',
    baseKey: 'member-center-history',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberCenterHistoryAPI = apiCrudService

const { API, route } = MemberCenterHistoryAPI

// Custom API for fetching Member Center History by Profile ID
export const getMemberCenterHistoryById = async ({
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

    const response = await API.get<IMemberCenterHistoryPaginated>(url)
    return response.data
}

// 🪝 Custom Hook for Fetching Member Center History by Profile ID
export const useGetMemberCenterHistoryById = ({
    profileId,
    query,
    options,
}: {
    profileId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberCenterHistoryPaginated, Error>
}) => {
    return useQuery<IMemberCenterHistoryPaginated, Error>({
        ...options,
        queryKey: [
            baseQueryKey,
            'member-profile',
            profileId,
            'paginated',
            query,
        ],
        queryFn: () => getMemberCenterHistoryById({ profileId, query }),
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

export const logger = Logger.getInstance('member-center-history')
