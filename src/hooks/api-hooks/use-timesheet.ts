import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { createMutationHook } from './api-hook-factory'
import * as TimesheetService from '@/api-service/timesheet-service'
import { toBase64 } from '@/utils'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    ITimesheet,
    IPaginatedTimesheet,
    ITimesheetInOutRequest,
    IFilterPaginatedHookProps,
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

export type TTimesheetHookMode = 'all' | 'me' | 'user-organization'

export const useFilteredPaginatedTimesheets = ({
    sort,
    mode,
    user_org_id,
    filterPayload,
    preloads = [],
    pagination = { pageSize: 10, pageIndex: 1 },
}: {
    mode?: TTimesheetHookMode
} & { user_org_id?: TEntityId } & IFilterPaginatedHookProps) => {
    return useQuery<IPaginatedTimesheet, string>({
        queryKey: [
            'timesheet',
            'resource-query',
            mode,
            user_org_id,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            let url: string = ``

            if (mode === 'me') {
                url = 'me'
            } else if (mode === 'user-organization') {
                url = `user-organization/${user_org_id}`
            }

            const [error, result] = await withCatchAsync(
                TimesheetService.getPaginatedTimesheets({
                    url,
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 1,
            totalPage: 1,
            ...pagination,
        },
        retry: 1,
    })
}

export const useTimeInOut = createMutationHook<
    ITimesheet,
    string,
    ITimesheetInOutRequest
>((data) => TimesheetService.timeInOut(data), 'Timesheet has been save.')
