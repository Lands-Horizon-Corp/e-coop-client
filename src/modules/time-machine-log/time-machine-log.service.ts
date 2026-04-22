import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    ITimeMachineLog,
    TTimeMachineCancelRequest,
    TTimeMachineLogRequest,
} from '../time-machine-log'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: timeMachineLogBaseKey,
} = createDataLayerFactory<ITimeMachineLog, TTimeMachineLogRequest>({
    url: '/api/v1/time-machine-log',
    baseKey: 'time-machine-log',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: timeMachineLogAPIRoute, // matches url above

    create: createTimeMachineLog,
    updateById: updateTimeMachineLogById,

    deleteById: deleteTimeMachineLogById,
    deleteMany: deleteManyTimeMachineLog,

    getById: getTimeMachineLogById,
    getAll: getAllTimeMachineLog,
    getPaginated: getPaginatedTimeMachineLog,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { timeMachineLogBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateTimeMachineLog,
    useUpdateById: useUpdateTimeMachineLogById,

    useGetAll: useGetAllTimeMachineLog,
    useGetById: useGetTimeMachineLogById,
    useGetPaginated: useGetPaginatedTimeMachineLog,

    useDeleteById: useDeleteTimeMachineLogById,
    useDeleteMany: useDeleteManyTimeMachineLog,
} = apiCrudHooks

export const useTimeMachineCancel = createMutationFactory<
    ITimeMachineLog,
    Error,
    TTimeMachineCancelRequest & { userOrganizationId?: TEntityId }
>({
    defaultInvalidates: [[timeMachineLogBaseKey]],
    mutationFn: async ({ userOrganizationId, ...payload }) => {
        const url = userOrganizationId
            ? `${timeMachineLogAPIRoute}/user-organization/${userOrganizationId}/cancel`
            : `${timeMachineLogAPIRoute}/cancel`

        return (
            await API.put<TTimeMachineCancelRequest, ITimeMachineLog>(
                url,
                payload
            )
        ).data
    },
    invalidationFn(args) {
        args.queryClient.invalidateQueries({
            queryKey: ['auth', 'context'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['user-organization', 'current'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'current'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['user-organization'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['disbursement-transaction'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['transaction', 'current-branch'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'paginated', 'all'],
        })
    },
})

export const useCreateTimeMachine = createMutationFactory<
    ITimeMachineLog,
    Error,
    TTimeMachineLogRequest & { userOrganizationId?: TEntityId }
>({
    defaultInvalidates: [[timeMachineLogBaseKey]],
    mutationFn: async ({ userOrganizationId, ...payload }) => {
        const url = userOrganizationId
            ? `${timeMachineLogAPIRoute}/user-organization/${userOrganizationId}`
            : `${timeMachineLogAPIRoute}`

        return (
            await API.post<TTimeMachineLogRequest, ITimeMachineLog>(
                url,
                payload
            )
        ).data
    },
    invalidationFn(args) {
        args.queryClient.invalidateQueries({
            queryKey: ['auth', 'context'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['user-organization', 'current'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'current'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['disbursement-transaction'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['transaction', 'current-branch'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'paginated', 'all'],
        })
    },
})

export const useGetTimeMachineLogs = ({
    userOrganizationId,
    options,
}: {
    userOrganizationId?: TEntityId
    options?: HookQueryOptions<ITimeMachineLog[], Error>
}) => {
    return useQuery<ITimeMachineLog[], Error>({
        queryKey: [timeMachineLogBaseKey, 'all'],
        queryFn: async () => {
            return (
                await API.get<ITimeMachineLog[]>(
                    `${timeMachineLogAPIRoute}/user-organization/${userOrganizationId}`
                )
            ).data
        },
        ...options,
    })
}

export const logger = Logger.getInstance('time-machine-log')
// custom hooks can go here
