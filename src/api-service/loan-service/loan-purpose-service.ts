import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import {
    ILoanTransaction,
    ILoanTransactionRequest,
} from '@/types/coop-types/loan-types/loan-transaction'

import { ILoanPurpose } from '@/types'

const CrudServices = createAPICrudService<
    ILoanTransaction,
    ILoanTransactionRequest
>('/loan-transaction')
const CollectionServices =
    createAPICollectionService<ILoanPurpose>('/loan-purpose')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
