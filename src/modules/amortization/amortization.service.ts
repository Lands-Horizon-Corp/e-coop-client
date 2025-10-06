import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IAmortization, IAmortizationRequest } from '../amortization'

const {
    // apiCrudHooks,
    apiCrudService,
    baseQueryKey: amortizationBaseKey,
} = createDataLayerFactory<IAmortization, IAmortizationRequest>({
    url: '/api/v1/amortization',
    baseKey: 'amortization',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: amortizationAPIRoute, // matches url above

    // create: createAmortization,
    // updateById: updateAmortizationById,

    // deleteById: deleteAmortizationById,
    // deleteMany: deleteManyAmortization,

    // getById: getAmortizationById,
    // getAll: getAllAmortization,
    // getPaginated: getPaginatedAmortization,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { amortizationBaseKey } // Exported in case it's needed outside

// export const {
//     useCreate: useCreateAmortization,
//     useUpdateById: useUpdateAmortizationById,

//     useGetAll: useGetAllAmortization,
//     useGetById: useGetAmortizationById,
//     useGetPaginated: useGetPaginatedAmortization,

//     useDeleteById: useDeleteAmortizationById,
//     useDeleteMany: useDeleteManyAmortization,
// } = apiCrudHooks

// custom hooks can go here
