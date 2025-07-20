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
>('/automatic-loan-deduction')
const CollectionServices = createAPICollectionService<IAutomaticLoanDeduction>(
    '/automatic-loan-deduction'
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
