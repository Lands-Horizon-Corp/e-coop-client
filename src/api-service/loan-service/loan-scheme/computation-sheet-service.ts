import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IComputationSheet, IComputationSheetRequest } from '@/types'

const CrudServices = createAPICrudService<
    IComputationSheet,
    IComputationSheetRequest
>('/computation-sheet')
const CollectionServices =
    createAPICollectionService<IComputationSheet>('/computation-sheet')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
