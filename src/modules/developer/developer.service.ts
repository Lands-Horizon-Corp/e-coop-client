import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import API from '@/providers/api'
import { HookQueryOptions } from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { IAPIKey, IAPIList } from './developer.types'

// ⚙️🛠️ API SERVICE HERE

// API function to refresh the API key
export const refreshAPIKey = async (): Promise<IAPIKey> => {
    const response = await API.post<void, IAPIKey>(
        '/api/v1/user-organization/developer-key-refresh'
    )
    return response.data
}

// API function to fetch all API routes
export const getGroupRoutes = async ({
    url,
}: {
    url?: string
} = {}): Promise<IAPIList> => {
    const newUrl = qs.stringifyUrl({ url: url || `/api/routes` })
    const response = await API.get<IAPIList>(newUrl)
    return response.data
}

// 🪝 HOOKS START HERE

// Mutation hook for refreshing the API key
export const useRefreshAPIKey = createMutationFactory<IAPIKey, Error, void>({
    mutationFn: async () => await refreshAPIKey(),
})

// Query hook for fetching all API routes
export const useGroupRoutes = ({
    options,
}: {
    options?: HookQueryOptions<IAPIList, string>
} = {}) => {
    return useQuery<IAPIList, string>({
        ...options,
        queryKey: ['api-list', 'all'],
        queryFn: async () => await getGroupRoutes(),
    })
}
