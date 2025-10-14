import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { ICompany, ICompanyRequest } from '../company'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: companyBaseKey,
} = createDataLayerFactory<ICompany, ICompanyRequest>({
    url: '/api/v1/company',
    baseKey: 'company',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: companyAPIRoute, // matches url above

    create: createCompany,
    updateById: updateCompanyById,

    deleteById: deleteCompanyById,
    deleteMany: deleteManyCompany,

    getById: getCompanyById,
    getAll: getAllCompany,
    getPaginated: getPaginatedCompany,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { companyBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateCompany,
    useUpdateById: useUpdateCompanyById,

    useGetAll: useGetAllCompany,
    useGetById: useGetCompanyById,
    useGetPaginated: useGetPaginatedCompany,

    useDeleteById: useDeleteCompanyById,
    useDeleteMany: useDeleteManyCompany,
} = apiCrudHooks

// custom hooks can go here
export const logger = Logger.getInstance('company')
