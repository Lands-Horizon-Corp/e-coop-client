import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as HolidayService from '@/api-service/holiday-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IHoliday,
    IHolidayPaginated,
    IHolidayRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

// Create
export const useCreateHoliday = createMutationHook<
    IHoliday,
    string,
    IHolidayRequest
>(
    (data) => HolidayService.create(data),
    'Holiday created',
    (args) => createMutationInvalidateFn('holiday', args)
)

// Update
export const useUpdateHoliday = createMutationHook<
    IHoliday,
    string,
    { holidayId: TEntityId; data: IHolidayRequest }
>(
    ({ holidayId, data }) => HolidayService.updateById(holidayId, data),
    'Holiday updated',
    (args) => updateMutationInvalidationFn('holiday', args)
)

// Delete
export const useDeleteHoliday = createMutationHook<void, string, TEntityId>(
    (id) => HolidayService.deleteById(id),
    'Holiday deleted',
    (args) => deleteMutationInvalidationFn('holiday', args)
)

// Get all holidays
export const useMemberClassifications = ({
    enabled,
    showMessage,
}: IAPIHook<IHoliday[], string> & IQueryProps = {}) => {
    return useQuery<IHoliday[], string>({
        queryKey: ['holiday', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                HolidayService.allList()
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
                HolidayService.search({
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
