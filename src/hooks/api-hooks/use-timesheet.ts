import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as TimesheetService from '@/api-service/timesheet-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIHook,
    IFilterPaginatedHookProps,
    IPaginatedTimesheet,
    IQueryProps,
    ITimesheet,
    ITimesheetInOutRequest,
    TEntityId,
} from '@/types'

import {
    createMutationHook,
    createMutationInvalidateFn,
} from '../../factory/api-hook-factory'

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

export type TTimesheetHookMode = 'all' | 'me' | 'employee'

export const useFilteredPaginatedTimesheets = ({
    sort,
    mode,
    userOrganizationId,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 1 },
}: {
    mode?: TTimesheetHookMode
} & { userOrganizationId?: TEntityId } & IFilterPaginatedHookProps) => {
    return useQuery<IPaginatedTimesheet, string>({
        queryKey: [
            'timesheet',
            'resource-query',
            mode,
            userOrganizationId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            let url: string = `search`

            if (mode === 'me') {
                url = 'me/search'
            } else if (mode === 'employee') {
                url = `employee/${userOrganizationId}/search`
            }

            const [error, result] = await withCatchAsync(
                TimesheetService.getPaginatedTimesheets({
                    url,
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
>(
    (data) => TimesheetService.timeInOut(data),
    'Timesheet has been save.',
    (args) => createMutationInvalidateFn('timesheet', args)
)
