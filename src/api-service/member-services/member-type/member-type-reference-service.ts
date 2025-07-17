import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IMemberTypeReference, IMemberTypeReferenceRequest } from '@/types'

const CrudServices = createAPICrudService<
    IMemberTypeReference,
    IMemberTypeReferenceRequest
>('/member-type-reference')

const CollectionServices = createAPICollectionService<IMemberTypeReference>(
    `member-type-reference`
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default {
    ...CrudServices,
    ...CollectionServices,
}
