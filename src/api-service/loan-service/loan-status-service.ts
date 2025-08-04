import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { ILoanStatus, ILoanStatusRequest } from '@/types'

const CrudServices = createAPICrudService<ILoanStatus, ILoanStatusRequest>(
    '/api/v1/loan-status'
)
const CollectionServices =
    createAPICollectionService<ILoanStatus>('/api/v1/loan-status')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
