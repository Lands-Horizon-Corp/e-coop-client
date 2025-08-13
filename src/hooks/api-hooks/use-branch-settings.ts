import branchSettingsService from '@/api-service/branch-settings-service'
import {
    createMutationHook,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'

import { IBranchSettings, IBranchSettingsRequest } from '@/types'

export const useUpdateCurrentBranchSettings = createMutationHook<
    IBranchSettings,
    string,
    IBranchSettingsRequest
>(
    (data) => branchSettingsService.updateCurrentBranchSettings(data),
    'Branch settings updated',
    (args) => updateMutationInvalidationFn('branch-settings', args)
)
