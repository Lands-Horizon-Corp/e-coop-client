import { useMutation } from '@tanstack/react-query'

import API from '@/providers/api'
import { HookMutationOptions } from '@/providers/repositories/data-layer-factory'

import { IAPIKey } from './developer.types'

export const refreshAPIKey = async (): Promise<IAPIKey> => {
    const response = await API.post<void, IAPIKey>(
        '/api/v1/user-organization/developer-key-refresh'
    )
    return response.data
}

export const useRefreshAPIKey = ({
    options,
}: {
    options?: HookMutationOptions<IAPIKey, Error, void>
} = {}) => {
    return useMutation<IAPIKey, Error, void>({
        ...options,
        mutationFn: async () => await refreshAPIKey(),
    })
}
