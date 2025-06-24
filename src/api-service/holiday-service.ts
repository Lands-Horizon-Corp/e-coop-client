import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { IHoliday, IHolidayRequest } from '@/types'

const CrudServices = createAPICrudService<IHoliday, IHolidayRequest>('/holiday')
const CollectionServices = createAPICollectionService<IHoliday>('/holiday')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
