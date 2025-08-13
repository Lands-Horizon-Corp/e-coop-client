import {
    createAPICollectionService,
    createAPICrudService,
    createAPIExportableService,
} from '@/factory/api-factory-service'

import { ILoanPurpose, ILoanPurposeRequest } from '@/types'

const CrudServices = createAPICrudService<ILoanPurpose, ILoanPurposeRequest>(
    '/api/v1/loan-transaction'
)
const CollectionServices = createAPICollectionService<ILoanPurpose>(
    '/api/v1/loan-transaction'
)

const ExportServices = createAPIExportableService('/api/v1/loan-transaction')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices, ...ExportServices }
