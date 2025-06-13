import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    createQueryHook,
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from './api-hook-factory'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as HolidayService from '@/api-service/holiday-service'

import {
    IHoliday,
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
>(
    (data) => HolidayService.createHoliday(data),
    'Holiday created',
    (args) => createMutationInvalidateFn('holiday', args)
)

// Update
export const useUpdateHoliday = createMutationHook<
    IHoliday,
    string,
    { holidayId: TEntityId; data: IHolidayRequest }
>(
    ({ holidayId, data }) => HolidayService.updateHoliday(holidayId, data),
    'Holiday updated',
    (args) => updateMutationInvalidationFn('holiday', args)
)

// Delete
export const useDeleteHoliday = createMutationHook<void, string, TEntityId>(
    (id) => HolidayService.deleteHoliday(id),
    'Holiday deleted',
    (args) => deleteMutationInvalidationFn('holiday', args)
)

// Get all holidays
export const useHolidays = createQueryHook<IHoliday[], string>(
    ['holiday', 'resource-query', 'all'],
    () => HolidayService.getAllHolidays(),
    []
)

// Paginated/filtered holidays
export const useFilteredPaginatedHolidays = ({
    sort,
    enabled,
    filterPayload,
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
