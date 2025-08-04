import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import {
    IAutomaticLoanDeduction,
    IAutomaticLoanDeductionRequest,
} from '@/types'

const CrudServices = createAPICrudService<
    IAutomaticLoanDeduction,
    IAutomaticLoanDeductionRequest
>('/api/v1/automatic-loan-deduction')
const CollectionServices = createAPICollectionService<IAutomaticLoanDeduction>(
    '/api/v1/automatic-loan-deduction'
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
