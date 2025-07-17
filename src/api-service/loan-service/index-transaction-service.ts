import {
    createAPICollectionService,
    createAPICrudService,
    createAPIExportableService,
} from '@/factory/api-factory-service'

import { ILoanPurpose, ILoanPurposeRequest } from '@/types'

const CrudServices = createAPICrudService<ILoanPurpose, ILoanPurposeRequest>(
    'loan-transaction'
)
const CollectionServices =
    createAPICollectionService<ILoanPurpose>('loan-transaction')

const ExportServices = createAPIExportableService('loan-transaction')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices, ...ExportServices }
