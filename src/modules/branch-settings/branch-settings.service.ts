import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import type {
    IBranchSettings,
    IBranchSettingsRequest,
} from '../branch-settings'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: branchSettingsBaseKey,
} = createDataLayerFactory<IBranchSettings, IBranchSettingsRequest>({
    url: '/api/v1/branch-settings',
    baseKey: 'branch-settings',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: branchSettingsAPIRoute, // matches url above

    create: createBranchSettings,
    updateById: updateBranchSettingsById,

    deleteById: deleteBranchSettingsById,
    deleteMany: deleteManyBranchSettings,

    getById: getBranchSettingsById,
    getAll: getAllBranchSettings,
    getPaginated: getPaginatedBranchSettings,
} = apiCrudService

// custom service functions can go here

export const updateCurrentBranchSettings = async (
    data: IBranchSettingsRequest
) => {
    const response = await API.put<IBranchSettingsRequest, IBranchSettings>(
        branchSettingsAPIRoute,
        data
    )
    return response.data
}

// 🪝 HOOK STARTS HERE
export { branchSettingsBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateBranchSettings,
    useUpdateById: useUpdateBranchSettingsById,

    useGetAll: useGetAllBranchSettings,
    useGetById: useGetBranchSettingsById,
    useGetPaginated: useGetPaginatedBranchSettings,

    useDeleteById: useDeleteBranchSettingsById,
    useDeleteMany: useDeleteManyBranchSettings,
} = apiCrudHooks

// custom hooks can go here

export const useUpdateCurrentBranchSettings = createMutationFactory<
    IBranchSettings,
    Error,
    IBranchSettingsRequest
>({
    mutationFn: (data) => updateCurrentBranchSettings(data),
    invalidationFn: (args) =>
        updateMutationInvalidationFn('branch-settings', args),
})

export const logger = Logger.getInstance('branch-settings')
