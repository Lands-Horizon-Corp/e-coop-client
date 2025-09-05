import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IMemberDepartmentHistory,
    IMemberDepartmentHistoryPaginated,
} from './member-department-history.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberDepartmentHistory,
    void
>({
    url: '/api/v1/member-department-history',
    baseKey: 'member-department-history',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberDepartmentHistoryAPI = apiCrudService

// Custom API for fetching Member Department History by Profile ID
export const getMemberDepartmentHistoryById = async ({
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
            url: `${MemberDepartmentHistoryAPI.route}/member-profile/${profileId}/search`,
            query,
        },
        { skipNull: true }
    )

    const response =
        await MemberDepartmentHistoryAPI.API.get<IMemberDepartmentHistoryPaginated>(
            url
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

// 🪝 Custom Hook for Fetching Member Department History
export const useMemberDepartmentHistory = ({
    profileId,
    query,
    options,
}: {
    profileId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberDepartmentHistoryPaginated, Error>
}) => {
    return useQuery<IMemberDepartmentHistoryPaginated, Error>({
        ...options,
        queryKey: [
            'member-department-history',
            'member-profile',
            profileId,
            'paginated',
            query,
        ],
        queryFn: () => getMemberDepartmentHistoryById({ profileId, query }),
    })
}
