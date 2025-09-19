import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IComakerCollateral, IComakerCollateralRequest } from '.'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: comakerCollateralBaseKey,
} = createDataLayerFactory<IComakerCollateral, IComakerCollateralRequest>({
    url: '/api/v1/comaker-collateral',
    baseKey: 'comaker-collateral',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: comakerCollateralAPIRoute, // matches url above

    create: createComakerCollateral,
    updateById: updateComakerCollateralById,

    deleteById: deleteComakerCollateralById,
    deleteMany: deleteManyComakerCollateral,

    getById: getComakerCollateralById,
    getAll: getAllComakerCollateral,
    getPaginated: getPaginatedComakerCollateral,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { comakerCollateralBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateComakerCollateral,
    useUpdateById: useUpdateComakerCollateralById,

    useGetAll: useGetAllComakerCollateral,
    useGetById: useGetComakerCollateralById,
    useGetPaginated: useGetPaginatedComakerCollateral,

    useDeleteById: useDeleteComakerCollateralById,
    useDeleteMany: useDeleteManyComakerCollateral,
} = apiCrudHooks

// custom hooks can go here
