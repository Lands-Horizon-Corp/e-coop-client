import { createAPICollectionService } from '@/factory/api-factory-service'

import { IGroupedRoute } from '@/types'

const collectionServices =
    createAPICollectionService<IGroupedRoute>('/api/routes')

export default { ...collectionServices }
