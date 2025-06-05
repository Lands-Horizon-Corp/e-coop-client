import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { createMutationHook } from './api-hooks/api-hook-factory'
import * as TimesheetService from '@/api-service/timesheet-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    ITimesheet,
    IPaginatedTimesheet,
    ITimesheetInOutRequest,
} from '@/types'

export const useTimesheet = ({
    id,
    enabled,
    showMessage = true,
}: IAPIHook<ITimesheet, string> & IQueryProps & { id: TEntityId }) => {
    return useQuery<ITimesheet, string>({
        queryKey: ['timesheet', id],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TimesheetService.getTimesheetById(id)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        enabled,
        retry: 1,
    })
}

export const useCurrentTimesheet = ({
    showMessage = true,
    retry = 0,
    onError,
    onSuccess,
    ...other
}: IAPIHook<ITimesheet, string> & IQueryProps<ITimesheet> = {}) => {
    return useQuery<ITimesheet, string>({
        queryKey: ['timesheet', 'current'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TimesheetService.getCurrentTimesheet()
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(result)
            return result
        },
        retry,
        ...other,
    })
}

export const usePaginatedTimesheets = ({
    sort,
    filters,
    preloads,
    pagination,
    enabled,
    showMessage = true,
}: IQueryProps & {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    return useQuery<IPaginatedTimesheet, string>({
        queryKey: [
            'timesheet',
            'paginated',
            { sort, filters, preloads, pagination },
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TimesheetService.getPaginatedTimesheets({
                    sort,
                    filters,
                    preloads,
                    pagination,
                })
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        enabled,
        retry: 1,
    })
}

export const useMyPaginatedTimesheets = ({
    sort,
    filters,
    preloads,
    pagination,
    enabled,
    showMessage = true,
}: IQueryProps & {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    return useQuery<IPaginatedTimesheet, string>({
        queryKey: ['timesheet', 'me', { sort, filters, preloads, pagination }],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TimesheetService.getMyPaginatedTimesheets({
                    sort,
                    filters,
                    preloads,
                    pagination,
                })
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        enabled,
        retry: 1,
    })
}

export const useUserPaginatedTimesheets = ({
    userId,
    sort,
    filters,
    preloads,
    pagination,
    enabled,
    showMessage = true,
}: IQueryProps & {
    userId: TEntityId
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    return useQuery<IPaginatedTimesheet, string>({
        queryKey: [
            'timesheet',
            'user',
            userId,
            { sort, filters, preloads, pagination },
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                TimesheetService.getUserPaginatedTimesheets({
                    userId,
                    sort,
                    filters,
                    preloads,
                    pagination,
                })
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        enabled,
        retry: 1,
    })
}

export const useTimeInOut = createMutationHook<
    ITimesheet,
    string,
    ITimesheetInOutRequest
>((data) => TimesheetService.timeInOut(data), 'Timesheet has been save.')
