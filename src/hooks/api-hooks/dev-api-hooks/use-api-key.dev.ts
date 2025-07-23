import apiKeyService from '@/api-service/developer-services/api-key-service'
import { createMutationHook } from '@/factory/api-hook-factory'

import { IAPIKey } from '@/types'

export const useRefreshAPIKey = createMutationHook<IAPIKey, string, void>(
    () => apiKeyService.refreshAPIKey(),
    'New API Key was generated for you.'
)
