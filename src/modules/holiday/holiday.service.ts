import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IHoliday,
    IHolidayRequest,
    IHolidayYears,
    THolidayHookMode,
} from '../holiday'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: holidayBaseKey,
} = createDataLayerFactory<IHoliday, IHolidayRequest>({
    url: '/api/v1/holiday',
    baseKey: 'holiday',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: holidayAPIRoute, // matches url above

    create: createHoliday,
    updateById: updateHolidayById,

    deleteById: deleteHolidayById,
    deleteMany: deleteManyHoliday,

    getById: getHolidayById,
    getAll: getAllHoliday,
    getPaginated: getPaginatedHoliday,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { holidayBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateHoliday,
    useUpdateById: useUpdateHolidayById,

    // useGetAll: useGetAllHoliday,
    useGetById: useGetHolidayById,
    useGetPaginated: useGetPaginatedHoliday,

    useDeleteById: useDeleteHolidayById,
    useDeleteMany: useDeleteManyHoliday,
} = apiCrudHooks

// custom hooks can go here

// /api/v1/holiday/year/:year/currency/:currency/copy/:year

// For holiday year mode
type THolidayYearHookMode = 'all' | 'currency'

// GET YEARS
export const useGetHolidayAvailableYears = ({
    options,
    currencyId,
    mode = 'all',
}: {
    currencyId?: TEntityId
    options?: HookQueryOptions<IHolidayYears[], Error>
    mode?: THolidayYearHookMode
} = {}) => {
    return useQuery<IHolidayYears[], Error>({
        ...options,
        queryKey: [holidayBaseKey, 'available-years', mode, currencyId].filter(
            Boolean
        ),
        queryFn: async () => {
            let url = `${holidayAPIRoute}/year-available`

            if (mode === 'currency') {
                url = `${holidayAPIRoute}/currency/${currencyId}/year-available`
            }

            const response = await API.get<IHolidayYears[]>(url)
            return response.data
        },
    })
}

// Holidays
export const useGetAllHolidays = ({
    mode = 'all',
    year,
    currencyId,
    query,
    options,
}: {
    mode?: THolidayHookMode
    year?: number
    currencyId?: string
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IHoliday[], Error>
} = {}) => {
    return useQuery<IHoliday[], Error>({
        ...options,
        queryKey: [holidayBaseKey, 'all', mode, year, currencyId, query].filter(
            Boolean
        ),
        queryFn: async () => {
            let url = `${holidayAPIRoute}/all`

            if (mode === 'year') {
                url = `${holidayAPIRoute}/year/${year}`
            } else if (mode === 'currency') {
                url = `${holidayAPIRoute}/currency/${currencyId}`
            } else if (mode === 'year-currency') {
                url = `${holidayAPIRoute}/year/${year}/currency/${currencyId}`
            }

            return getAllHoliday({
                url,
                query,
            })
        },
    })
}

// Copy holiday as template from other holiday year
export const useCopyYearHoliday = createMutationFactory<
    IHoliday[],
    Error,
    { year: number; currencyId: TEntityId; copyYear: number }
>({
    mutationFn: async ({ copyYear, currencyId, year }) => {
        const response = await API.post<void, IHoliday[]>(
            `${holidayAPIRoute}/year/${year}/currency/${currencyId}/copy/${copyYear}`
        )
        return response.data
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [holidayBaseKey, 'all'],
        })
        args.queryClient.invalidateQueries({
            queryKey: [holidayBaseKey, 'available-years'],
        })
    },
    defaultInvalidates: [
        [holidayBaseKey, 'paginated'],
        [holidayBaseKey, 'all'],
    ],
})

export const logger = Logger.getInstance('holiday')
