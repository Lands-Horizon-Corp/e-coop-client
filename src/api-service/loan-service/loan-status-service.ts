import {
    createAPICrudService,
    createAPICollectionService,
} from '@/factory/api-factory-service'
import { ILoanStatus, ILoanStatusRequest } from '@/types'

const CrudServices = createAPICrudService<ILoanStatus, ILoanStatusRequest>(
    '/loan-status'
)
const CollectionServices =
    createAPICollectionService<ILoanStatus>('/loan-status')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
