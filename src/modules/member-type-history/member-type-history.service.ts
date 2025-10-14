import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IMemberTypeHistory,
    IMemberTypeHistoryPaginated,
} from './member-type-history.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberTypeHistory,
    void
>({
    url: '/api/v1/member-type-history',
    baseKey: 'member-type-history',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberTypeHistoryAPI = apiCrudService

// Custom API for fetching Member Type History by Profile ID
export const getMemberTypeHistoryById = async ({
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
            url: `${MemberTypeHistoryAPI.route}/member-profile/${profileId}/search`,
            query,
        },
        { skipNull: true }
    )

    const response =
        await MemberTypeHistoryAPI.API.get<IMemberTypeHistoryPaginated>(url)
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

// 🪝 Custom Hook for Fetching Member Type History
export const useMemberTypeHistory = ({
    profileId,
    query,
    options,
}: {
    profileId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberTypeHistoryPaginated, Error>
}) => {
    return useQuery<IMemberTypeHistoryPaginated, Error>({
        ...options,
        queryKey: [
            'member-type-history',
            'member-profile',
            profileId,
            'paginated',
            query,
        ],
        queryFn: () => getMemberTypeHistoryById({ profileId, query }),
    })
}

export const logger = Logger.getInstance('member-type-history')
