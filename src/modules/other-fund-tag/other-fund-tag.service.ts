import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type { IOtherFundTag, IOtherFundTagRequest } from '../other-fund-tag'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: otherFundTagBaseKey,
} = createDataLayerFactory<IOtherFundTag, IOtherFundTagRequest>({
    url: '/api/v1/other-fund-tag',
    baseKey: 'other-fund-tag',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API,
    route: otherFundTagAPIRoute,

    create: createOtherFundTag,
    updateById: updateOtherFundTagById,

    deleteById: deleteOtherFundTagById,
    deleteMany: deleteManyOtherFundTag,

    getById: getOtherFundTagById,
    getAll: getAllOtherFundTag,
    getPaginated: getPaginatedOtherFundTag,
} = apiCrudService

export { otherFundTagBaseKey }

// 🪝 HOOK STARTS HERE
export const {
    useCreate: useCreateOtherFundTag,
    useUpdateById: useUpdateOtherFundTagById,

    // We comment this out to use our custom implementation below
    // useGetAll: useGetAllOtherFundTag,

    useGetById: useGetOtherFundTagById,
    useGetPaginated: useGetPaginatedOtherFundTag,

    useDeleteById: useDeleteOtherFundTagById,
    useDeleteMany: useDeleteManyOtherFundTag,
} = apiCrudHooks

/**
 * Custom Hook Mode for Other Fund Tags
 * 'all' - fetches the global list
 * 'other-fund' - fetches tags linked to a specific Other Fund ID
 */
export type TGetAllOtherFundTagHookMode = 'all' | 'other-fund'

export const useGetAllOtherFundTag = ({
    mode = 'all',
    otherFundId,
    query,
    options,
}: {
    mode: TGetAllOtherFundTagHookMode
    otherFundId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IOtherFundTag[], Error>
}) => {
    return useQuery<IOtherFundTag[], Error>({
        ...options,
        queryKey: [otherFundTagBaseKey, 'all', query, mode, otherFundId].filter(
            Boolean
        ),
        queryFn: async () => {
            let url = otherFundTagAPIRoute

            // Adjust URL based on the mode
            if (mode === 'other-fund' && otherFundId) {
                url = `${otherFundTagAPIRoute}/other-fund/${otherFundId}`
            }

            return await getAllOtherFundTag({
                query,
                url,
            })
        },
    })
}

export const logger = Logger.getInstance('other-fund-tag')
