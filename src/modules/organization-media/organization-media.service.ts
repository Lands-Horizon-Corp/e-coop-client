import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IOrganizationMedia,
    IOrganizationMediaRequest,
} from '../organization-media'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: organizationMediaBaseKey,
} = createDataLayerFactory<IOrganizationMedia, IOrganizationMediaRequest>({
    url: '/api/v1/organization-media',
    baseKey: 'organization-media',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: organizationMediaAPIRoute, // matches url above

    create: createOrganizationMedia,
    updateById: updateOrganizationMediaById,

    deleteById: deleteOrganizationMediaById,
    deleteMany: deleteManyOrganizationMedia,

    getById: getOrganizationMediaById,
    getAll: getAllOrganizationMedia,
    getPaginated: getPaginatedOrganizationMedia,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { organizationMediaBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateOrganizationMedia,
    // useUpdateById: useUpdateOrganizationMediaById,

    useGetAll: useGetAllOrganizationMedia,
    useGetById: useGetOrganizationMediaById,
    useGetPaginated: useGetPaginatedOrganizationMedia,

    // useDeleteById: useDeleteOrganizationMediaById,
    useDeleteMany: useDeleteManyOrganizationMedia,
} = apiCrudHooks

export const useUploadOrganizationBulkMedia = createMutationFactory<
    IOrganizationMedia,
    Error,
    {
        organizationId: TEntityId
    } & { ids: TEntityId[] }
>({
    mutationFn: async ({ ids, organizationId }) => {
        const url = `${organizationMediaAPIRoute}/bulk/organization/${organizationId}`
        return createOrganizationMedia({ url, payload: { ids } })
    },
    defaultInvalidates: [
        [organizationMediaBaseKey, 'paginated'],
        [organizationMediaBaseKey, 'all'],
    ],
})

export const useGetAllOrganizationMediaByOrganization = ({
    mode,
    query,
    options,
    organizationId,
}: {
    mode?: 'all' | 'org-media'
    organizationId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IOrganizationMedia[], Error>
} = {}) => {
    return useQuery<IOrganizationMedia[], Error>({
        ...options,
        queryKey: [
            organizationMediaBaseKey,
            'all',
            mode,
            organizationId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url = `${organizationId}`

            if (mode === 'org-media') {
                url = `${organizationMediaAPIRoute}/organization/${organizationId}`
            }

            return getAllOrganizationMedia({
                url,
                query,
            })
        },
    })
}

export const useDeleteOrganizationMediaById = createMutationFactory<
    void,
    Error,
    TEntityId
>({
    mutationFn: (id) => deleteOrganizationMediaById({ id }),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [organizationMediaBaseKey, 'all', 'org-media'],
        })
    },
})
export const useUpdateOrganizationMediaById = createMutationFactory<
    IOrganizationMedia,
    Error,
    { id: TEntityId; payload: IOrganizationMediaRequest }
>({
    mutationFn: async ({ id, payload }) => {
        const response = await API.put<typeof payload, IOrganizationMedia>(
            `${organizationMediaAPIRoute}/${id}`,
            payload
        )
        return response.data
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [organizationMediaBaseKey, 'all', 'org-media'],
        })
        updateMutationInvalidationFn(organizationMediaBaseKey, args)
    },
})

export const logger = Logger.getInstance('organization-media')
// custom hooks can go here
