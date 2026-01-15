import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    INotification,
    INotificationRequest,
    INotificationViewRequest,
} from '../notification'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: notificationBaseKey,
} = createDataLayerFactory<INotification, INotificationRequest>({
    url: '/api/v1/notification',
    baseKey: 'notification',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: notificationAPIRoute, // matches url above

    create: createNotification,
    updateById: updateNotificationById,

    deleteById: deleteNotificationById,
    deleteMany: deleteManyNotification,

    getById: getNotificationById,
    getAll: getAllNotification,
    getPaginated: getPaginatedNotification,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { notificationBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateNotification,
    useUpdateById: useUpdateNotificationById,

    // useGetAll: useGetAllNotification,
    useGetById: useGetNotificationById,
    useGetPaginated: useGetPaginatedNotification,

    // useDeleteById: useDeleteNotificationById,
    useDeleteMany: useDeleteManyNotification,
} = apiCrudHooks

export const useDeleteNotificationById = createMutationFactory<
    void,
    Error,
    TEntityId
>({
    mutationFn: (id) => deleteNotificationById({ id }),
    invalidationFn: (args) => {
        deleteMutationInvalidationFn(notificationBaseKey, args)
    },
    defaultInvalidates: [
        [notificationBaseKey, 'all'],
        [notificationBaseKey, 'all', 'me'],
    ],
})

export const useGetAllNotification = ({
    query,
    options,
}: {
    query?: TAPIQueryOptions
    options?: HookQueryOptions<INotification[], Error>
} = {}) => {
    return useQuery<INotification[], Error>({
        ...options,
        queryKey: [notificationBaseKey, 'all', 'me', query].filter(Boolean),
        queryFn: async () => {
            const url = `${notificationAPIRoute}/me`
            return getAllNotification({
                url,
                query,
            })
        },
    })
}

export const useViewNotification = createMutationFactory<
    INotification,
    Error,
    INotificationViewRequest
>({
    mutationFn: async (payload) => {
        const response = await API.put<INotificationViewRequest, INotification>(
            `${notificationAPIRoute}/view`,
            payload
        )

        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(notificationBaseKey, args),
    defaultInvalidates: [
        [notificationBaseKey, 'all'],
        [notificationBaseKey, 'all', 'me'],
    ],
})

export const useViewAllNotification = createMutationFactory<
    INotification,
    Error,
    void
>({
    mutationFn: async () => {
        const response = await API.put<void, INotification>(
            `${notificationAPIRoute}/view-all`
        )
        return response.data
    },
    invalidationFn: (args) => {
        updateMutationInvalidationFn(notificationBaseKey, args)
        args.queryClient.invalidateQueries({
            queryKey: [notificationBaseKey, 'all'],
        })
    },
})

export const logger = Logger.getInstance('notification')
// custom hooks can go here
