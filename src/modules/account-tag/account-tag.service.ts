import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import { IAccounTagRequest, IAccountTag } from './account-tag.types'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: accountTagBaseQueryKey,
} = createDataLayerFactory<IAccountTag, IAccounTagRequest>({
    url: 'api/v1/account-tag',
    baseKey: 'account-tag',
})

export const {
    API,
    route: accountTagAPIRoute,
    getAll: getAllAccountTag,
} = apiCrudService

export { accountTagBaseQueryKey }

export const {
    useCreate: useCreateAccountTag,
    useDeleteById: useDeleteAccountTagById,
    useUpdateById,
    useGetById,
    useGetAll,
    useDeleteMany,
    useGetPaginated,
} = apiCrudHooks

export type TGetAllAccountTagHookMode = 'all' | 'account-tag'

export const useGetAllAccountTag = ({
    query,
    mode = 'all',
    options,
    accountId,
}: {
    query?: TAPIQueryOptions
    mode: TGetAllAccountTagHookMode
    options?: HookQueryOptions<IAccountTag[], Error>
    accountId?: TEntityId
}) => {
    return useQuery<IAccountTag[], Error>({
        queryKey: ['getAll', mode, query, accountId],
        queryFn: async () => {
            let url = accountTagAPIRoute
            if (mode === 'account-tag' && accountId) {
                url = `${accountTagAPIRoute}/account/${accountId}`
            }
            return getAllAccountTag({ query, url })
        },
        ...options,
    })
}

export const logger = Logger.getInstance('account-tag')
