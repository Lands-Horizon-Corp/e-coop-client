import { createAPIObjectService } from '@/factory/api-factory-service'

import { IAPIList } from '@/types'

const collectionServices = createAPIObjectService<IAPIList>('/api/routes')

export default { ...collectionServices }
