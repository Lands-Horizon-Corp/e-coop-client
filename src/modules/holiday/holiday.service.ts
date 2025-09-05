import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IHoliday, IHolidayRequest } from '../holiday'

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

    useGetAll: useGetAllHoliday,
    useGetById: useGetHolidayById,
    useGetPaginated: useGetPaginatedHoliday,

    useDeleteById: useDeleteHolidayById,
    useDeleteMany: useDeleteManyHoliday,
} = apiCrudHooks

// custom hooks can go here
