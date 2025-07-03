import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { ILoanPurpose, ILoanPurposeRequest } from '@/types'

const CrudServices = createAPICrudService<ILoanPurpose, ILoanPurposeRequest>(
    '/loan-status'
)
const CollectionServices =
    createAPICollectionService<ILoanPurpose>('/loan-purpose')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
