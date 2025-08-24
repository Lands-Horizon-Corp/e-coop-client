import { useMutation, useQuery } from '@tanstack/react-query'

import {
    HookMutationOptions,
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { IPaginatedResult, TAPIQueryOptions, TEntityId } from '@/types'

import { ITimesheet, ITimesheetInOutRequest } from './timesheet.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory({
    url: '/api/v1/timesheet',
    baseKey: 'timesheet',
})

// ⚙️🛠️ API SERVICE HERE

const { API, route } = apiCrudService

export const getCurrentTimesheet = async () => {
    const response = await API.get<ITimesheet>(`${route}, current`)
    return response.data
}

export const timeInOut = async (data: ITimesheetInOutRequest) => {
    const response = await API.post<ITimesheetInOutRequest, ITimesheet>(
        `${route}/time-in-and-out`,
        data
    )
    return response.data
}

// 🪝 HOOK STARTS HERE

export const { useGetById } = apiCrudHooks

export type TTimesheetHookMode = 'all' | 'me' | 'employee'

export const useGetPaginatedFootstep = ({
    mode,
    query,
    options,
    userOrganizationId,
}: {
    mode: TTimesheetHookMode
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IPaginatedResult<ITimesheet>>
    userOrganizationId?: TEntityId
}) => {
    return useQuery<IPaginatedResult<ITimesheet>>({
        ...options,
        queryKey: ['timesheet', 'paginated', query, mode],
        queryFn: async () => {
            if (mode === 'me') {
                return await apiCrudService.getPaginated({
                    query,
                    url: `${route}/me/search`,
                })
            } else if (mode === 'employee') {
                if (!userOrganizationId) {
                    throw new Error(
                        'userOrganizationId is required for employee mode'
                    )
                }
                return await apiCrudService.getPaginated({
                    query,
                    url: `${route}/employee/${userOrganizationId}/search`,
                })
            } else if (mode === 'all') {
                return await apiCrudService.getPaginated({
                    query,
                    url: `${route}/search`,
                })
            } else {
                throw new Error('Invalid mode provided')
            }
        },
    })
}

export const useCurrentTimesheet = ({
    options,
}: {
    options?: HookQueryOptions<ITimesheet, Error>
} = {}) => {
    return useQuery<ITimesheet, Error>({
        ...options,
        queryKey: ['timesheet', 'current'],
        queryFn: async () => await getCurrentTimesheet(),
    })
}

export const useTimeInOut = ({
    options,
}: {
    options?: HookMutationOptions<ITimesheet, Error, ITimesheetInOutRequest>
} = {}) => {
    return useMutation<ITimesheet, Error, ITimesheetInOutRequest>({
        ...options,
        mutationFn: async (data) => await timeInOut(data),
    })
}
