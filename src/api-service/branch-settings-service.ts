import { IBranchSettings, IBranchSettingsRequest } from '@/types'

import APIService from './api-service'

export const updateCurrentBranchSettings = async (
    data: IBranchSettingsRequest
) => {
    const response = await APIService.put<
        IBranchSettingsRequest,
        IBranchSettings
    >('/api/v1/branch-settings', data)
    return response.data
}

export default {
    updateCurrentBranchSettings,
}
