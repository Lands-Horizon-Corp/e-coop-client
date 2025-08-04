import { createAPIObjectService } from '@/factory/api-factory-service'

import { IAPIList } from '@/types'

const collectionServices = createAPIObjectService<IAPIList>('/api/v1/api/routes')

export default { ...collectionServices }
