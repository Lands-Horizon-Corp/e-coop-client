import { UseMutationOptions, useMutation } from '@tanstack/react-query'

import { createAPIRepository } from '@/providers/repositories/api-crud-factory'

import type {
    IBranchSettings,
    IBranchSettingsRequest,
} from './branch-settings.types'

const { API, route } = createAPIRepository('/api/v1/branch-settings')

// API Functions
export const updateCurrentBranchSettings = async (
    data: IBranchSettingsRequest
): Promise<IBranchSettings> => {
    const endpoint = `${route}/current`
    return (
        await API.put<IBranchSettingsRequest, IBranchSettings>(endpoint, data)
    ).data
}

// custom hook
export const useUpdateCurrentBranchSettings = ({
    options,
}: {
    options?: UseMutationOptions<IBranchSettings, Error, IBranchSettingsRequest>
} = {}) => {
    return useMutation<IBranchSettings, Error, IBranchSettingsRequest>({
        mutationFn: updateCurrentBranchSettings,
        ...options,
    })
}
