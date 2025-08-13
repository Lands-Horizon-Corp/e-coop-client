import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IMemberDepartment, IMemberDepartmentRequest } from '@/types'

const CrudServices = createAPICrudService<
    IMemberDepartment,
    IMemberDepartmentRequest
>('/api/v1/member-department')
const CollectionServices = createAPICollectionService<IMemberDepartment>(
    '/api/v1/member-department'
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { search, allList } = CollectionServices

export default {
    ...CrudServices,
    ...CollectionServices,
}
