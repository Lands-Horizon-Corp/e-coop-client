import { Logger } from '@/helpers/loggers'
import type { INotification } from '@/modules/notification'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: notificationBaseKey,
} = createDataLayerFactory<INotification, never>({
    url: '/api/v1/notification',
    baseKey: 'notification',
})

export const {
    API,
    route: notificationAPIRoute,

    create: createNotification,
    updateById: updateNotificationById,

    deleteById: deleteNotificationById,
    deleteMany: deleteManyNotification,

    getById: getNotificationById,
    getAll: getAllNotification,
    getPaginated: getPaginatedNotification,
} = apiCrudService

export { notificationBaseKey }

export const {
    useCreate: useCreateNotification,
    useUpdateById: useUpdateNotificationById,

    useGetAll: useGetAllNotification,
    useGetById: useGetNotificationById,
    useGetPaginated: useGetPaginatedNotification,

    useDeleteById: useDeleteNotificationById,
    useDeleteMany: useDeleteManyNotification,
} = apiCrudHooks

export const logger = Logger.getInstance('notification')
