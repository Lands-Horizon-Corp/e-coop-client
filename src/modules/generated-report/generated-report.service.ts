import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    createMutationInvalidateFn,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    IGeneratedReport,
    IGeneratedReportAvailableModalResponse,
    IGeneratedReportPaginated,
    IGeneratedReportRequest,
    TModeGeneratedReport,
    TModelName,
} from '../generated-report'
import { IMedia } from '../media'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generatedReportBaseKey,
} = createDataLayerFactory<IGeneratedReport, IGeneratedReportRequest>({
    url: '/api/v1/generated-report',
    baseKey: 'generated-report',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: generatedReportAPIRoute, // matches url above

    // create: createGeneratedReport,
    updateById: updateGeneratedReportById,

    deleteById: deleteGeneratedReportById,
    deleteMany: deleteManyGeneratedReport,

    getById: getGeneratedReportById,
    getAll: getAllGeneratedReport,
    getPaginated: getPaginatedGeneratedReport,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { generatedReportBaseKey } // Exported in case it's needed outside

export const {
    // useCreate: useCreateGeneratedReport,
    useUpdateById: useUpdateGeneratedReportById,

    useGetAll: useGetAllGeneratedReport,
    useGetById: useGetGeneratedReportById,
    useGetPaginated: useGetPaginatedGeneratedReport,

    useDeleteById: useDeleteGeneratedReportById,
    useDeleteMany: useDeleteManyGeneratedReport,
} = apiCrudHooks

const createGeneratedReport = async (data: IGeneratedReportRequest) => {
    return (
        await API.post<IGeneratedReportRequest, IGeneratedReport>(
            generatedReportAPIRoute,
            data
        )
    ).data
}

const getAvailableModels = async () => {
    return (
        await API.get<IGeneratedReportAvailableModalResponse[]>(
            `${generatedReportAPIRoute}/available-models`
        )
    ).data
}

export const useCreateGeneratedReport = createMutationFactory<
    IGeneratedReport,
    Error,
    IGeneratedReportRequest
>({
    mutationFn: (data) => createGeneratedReport(data),
    invalidationFn: (args) =>
        createMutationInvalidateFn(generatedReportBaseKey, args),
})

export const useGenerateReportMarkAsFavorite = createMutationFactory<
    IGeneratedReport,
    Error,
    TEntityId
>({
    mutationFn: async (id) => {
        return (
            await API.put<TEntityId, IGeneratedReport>(
                `${generatedReportAPIRoute}/${id}/favorite`
            )
        ).data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(generatedReportBaseKey, args),
})

export const useDownloadReportByReportId = createMutationFactory<
    IMedia,
    Error,
    TEntityId
>({
    mutationFn: async (id) => {
        return (
            await API.post<TEntityId, IMedia>(
                `${generatedReportAPIRoute}/${id}/download`
            )
        ).data
    },
    invalidationFn: (args) =>
        createMutationInvalidateFn(generatedReportBaseKey, args),
})

export const useGetGeneratedReportAvailableModels = ({
    options,
}: {
    options: HookQueryOptions<IGeneratedReportAvailableModalResponse[]>
}) => {
    return useQuery<IGeneratedReportAvailableModalResponse[]>({
        queryKey: ['generated-report', 'available-models'],
        queryFn: getAvailableModels,
        ...options,
    })
}

export const useGetFilteredPaginatedGeneratedReport = ({
    options,
    mode,
    query,
    model,
}: {
    options?: HookQueryOptions<IGeneratedReportPaginated>
    mode: TModeGeneratedReport
    model: TModelName
    query?: Record<string, unknown>
}) => {
    return useQuery<IGeneratedReportPaginated>({
        queryKey: ['generated-report-paginated', mode, model, query],
        queryFn: async () => {
            const pathSegments: string[] = []
            let typeFilter = ''

            if (mode.includes('me')) {
                pathSegments.push('me')
            }

            if (mode.includes('pdf')) {
                typeFilter = 'pdf'
            } else if (mode.includes('excel')) {
                typeFilter = 'excel'
            } else if (mode.includes('favorites')) {
                typeFilter = 'favorites'
            }

            if (typeFilter) {
                pathSegments.push(typeFilter)
            }

            const isModelFiltered = model && model !== 'none'
            if (isModelFiltered) {
                pathSegments.push(`model/${model}`)
            }

            const constructedPath =
                pathSegments.length > 0 ? `/${pathSegments.join('/')}` : ''
            const url = `${generatedReportAPIRoute}${constructedPath}/search`

            return apiCrudService.getPaginated({
                url,
                query,
            })
        },
        ...options,
    })
}

export const logger = Logger.getInstance('generated-report')
