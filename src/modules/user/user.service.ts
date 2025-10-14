import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import type { TEntityId } from '@/types'

import { IMedia } from '../media'
import type { IUserBase } from './user.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IUserBase,
    void
>({
    url: '/api/v1/user',
    baseKey: 'user',
})

// ⚙️🛠️ API SERVICE HERE
export const UserAPI = apiCrudService

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

// API function to fetch user media
export const getUserMedias = async (userId: TEntityId) => {
    const res = await UserAPI.API.get<IMedia[]>(`/api/v1/user/${userId}/medias`)
    return res.data
}

// Query hook for fetching user media
export const useUserMedias = ({
    userId,
    options,
}: {
    userId: TEntityId
    options?: HookQueryOptions<IMedia[], Error>
}) => {
    return useQuery<IMedia[], Error>({
        retry: 0,
        ...options,
        queryKey: ['user', userId, 'medias'],
        queryFn: async () => getUserMedias(userId),
    })
}

export const logger = Logger.getInstance('user')
