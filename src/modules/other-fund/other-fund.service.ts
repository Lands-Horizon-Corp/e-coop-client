import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

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

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IOtherFund,
    IOtherFundPaginated,
    IOtherFundPrintRequest,
    IOtherFundRequest,
    TOtherFundActionMode,
    TOtherFundMode,
    TPrintMode,
} from '../other-fund'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: otherFundBaseKey,
} = createDataLayerFactory<IOtherFund, IOtherFundRequest>({
    url: '/api/v1/other-fund',
    baseKey: 'other-fund',
})

// ⚙️🛠️ API SERVICE
export const {
    API,
    route: otherFundAPIRoute,

    create: createOtherFund,
    updateById: updateOtherFundById,

    deleteById: deleteOtherFundById,
    deleteMany: deleteManyOtherFund,

    getById: getOtherFundById,
    getAll: getAllOtherFund,
    getPaginated: getPaginatedOtherFund,
} = apiCrudService

// 🪝 HOOKS
export { otherFundBaseKey }

export const {
    useCreate: useCreateOtherFund,
    useUpdateById: useUpdateOtherFundById,
    useGetById: useGetOtherFundById,
    useGetPaginated: useGetPaginatedOtherFund,
    useDeleteById: useDeleteOtherFundById,
    useDeleteMany: useDeleteManyOtherFund,
} = apiCrudHooks


export const useGetAllOtherFund = ({
    mode,
    query,
    options,
}: {
    mode?: TOtherFundMode
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IOtherFund[], Error>
}) => {
    return useQuery<IOtherFund[], Error>({
        ...options,
        queryKey: ['get-all-other-fund', mode, query].filter(Boolean),
        queryFn: async () => {
            let url = `${otherFundAPIRoute}`

            if (mode === 'release-today') {
                url = `${otherFundAPIRoute}/released/today`
            } else if (mode) {
                url = `${otherFundAPIRoute}/${mode}`
            }

            return getAllOtherFund({ url, query })
        },
    })
}

export const useCreateUpdateOtherFund = createMutationFactory<
    IOtherFund,
    Error,
    { payload: IOtherFundRequest; otherFundId?: TEntityId }
>({
    mutationFn: async ({ payload, otherFundId }) => {
        if (!otherFundId) {
            return await createOtherFund({ payload })
        }
        return updateOtherFundById({
            id: otherFundId,
            payload,
        })
    },
    invalidationFn: (args) => {
        updateMutationInvalidationFn(otherFundBaseKey, args)
        createMutationInvalidateFn(otherFundBaseKey, args)
    },
})

export const useFilteredPaginatedOtherFund = ({
    mode,
    query,
    options,
}: {
    mode?: 'approved' | 'unreleased'
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IOtherFundPaginated, Error>
}) => {
    return useQuery<IOtherFundPaginated, Error>({
        ...options,
        queryKey: ['other-fund', 'filtered-paginated', mode, query].filter(
            Boolean
        ),
        queryFn: async () => {
            const url: string = `${otherFundAPIRoute}/${mode ? mode : ''}/search`
            const finalUrl = qs.stringifyUrl({ url, query }, { skipNull: true })
            return await getPaginatedOtherFund<IOtherFund>({
                url: finalUrl,
                query,
            })
        },
    })
}

export const useEditPrintOtherFund = createMutationFactory<
    IOtherFund,
    Error,
    {
        other_fund_id: TEntityId
        voucher_number?: number
        mode: TPrintMode
    }
>({
    mutationFn: async ({ other_fund_id, voucher_number, mode }) => {
        const response = await API.put<{ voucher_number?: number }, IOtherFund>(
            `${otherFundAPIRoute}/${other_fund_id}/${mode ? mode : 'print'}`,
            mode ? {} : { voucher_number }
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(otherFundBaseKey, args),
})

export const useOtherFundActions = createMutationFactory<
    IOtherFund,
    Error,
    {
        other_fund_id: TEntityId
        mode: TOtherFundActionMode
    }
>({
    mutationFn: async ({ other_fund_id, mode = 'print-only' }) => {
        const response = await API.post<
            { other_fund_id?: TEntityId },
            IOtherFund
        >(`${otherFundAPIRoute}/${other_fund_id}/${mode}`)
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(otherFundBaseKey, args),
})

export const usePrintOtherFundTransaction = createMutationFactory<
    IOtherFund,
    Error,
    { otherFundId: TEntityId; payload: IOtherFundPrintRequest }
>({
    mutationFn: async (data) => {
        const response = await API.put<IOtherFundPrintRequest, IOtherFund>(
            `${otherFundAPIRoute}/${data.otherFundId}/print`,
            data.payload
        )
        return response.data
    },
    defaultInvalidates: [['auth', 'context']],
    invalidationFn: (args) =>
        updateMutationInvalidationFn(otherFundBaseKey, args),
})

export const logger = Logger.getInstance('other-fund')
