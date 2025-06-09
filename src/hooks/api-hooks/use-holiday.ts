import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { createMutationHook } from './api-hook-factory'
import * as HolidayService from '@/api-service/holiday-service'

import {
    IHoliday,
    IAPIHook,
    TEntityId,
    IQueryProps,
    IHolidayRequest,
    IHolidayPaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'

// Create
export const useCreateHoliday = createMutationHook<
    IHoliday,
    string,
    IHolidayRequest
>((data) => HolidayService.createHoliday(data), 'Holiday created')

// Update
export const useUpdateHoliday = createMutationHook<
    IHoliday,
    string,
    { holidayId: TEntityId; data: IHolidayRequest }
>(
    ({ holidayId, data }) => HolidayService.updateHoliday(holidayId, data),
    'Holiday updated'
)

// Delete
export const useDeleteHoliday = createMutationHook<void, string, TEntityId>(
    (id) => HolidayService.deleteHoliday(id),
    'Holiday deleted'
)

// Get all holidays
export const useHolidays = ({
    enabled,
    showMessage = true,
}: IAPIHook<IHoliday[], string> & IQueryProps = {}) => {
    return useQuery<IHoliday[], string>({
        queryKey: ['holiday', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                HolidayService.getAllHolidays()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}

// Paginated/filtered holidays
export const useFilteredPaginatedHolidays = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IHolidayPaginated, string> & IQueryProps = {}) => {
    return useQuery<IHolidayPaginated, string>({
        queryKey: [
            'holiday',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                HolidayService.getPaginatedHolidays({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
