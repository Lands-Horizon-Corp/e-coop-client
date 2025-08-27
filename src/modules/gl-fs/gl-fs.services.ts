import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    createMutationInvalidateFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId, UpdateIndexRequest } from '@/types'

import { ConnectAccountType, CreateAPIProps } from './gl-fs.types'

export const createGLSFSService = <
    TResponse extends { id: TEntityId },
    TRequest,
    TConnectAccountPayload = ConnectAccountType,
>(
    config: CreateAPIProps
) => {
    const { url, baseKey, connectAccountMutationKey, updateIndexMutationKey } =
        config

    const { apiCrudHooks } = createDataLayerFactory<TResponse, TRequest>({
        url,
        baseKey,
    })

    const { API, route } = createAPIRepository<TResponse, TRequest>(url)

    const updateIndex = async (
        changedItems: UpdateIndexRequest[]
    ): Promise<TResponse> => {
        const response = await Promise.all(
            changedItems.map((item) =>
                API.put<UpdateIndexRequest, TResponse>(
                    `${route}/${item.id}/index/${item.index}`
                )
            )
        )
        return response[0].data
    }

    const connectAccount = async ({
        id,
        accountId,
    }: ConnectAccountType): Promise<TResponse> => {
        return (
            await API.post<TConnectAccountPayload, TResponse>(
                `${route}/${id}/account/${accountId}/connect`
            )
        ).data
    }

    const useUpdateIndex = createMutationFactory<
        TResponse,
        Error,
        UpdateIndexRequest[]
    >({
        mutationFn: updateIndex,
        invalidationFn: (args) =>
            createMutationInvalidateFn(updateIndexMutationKey, args),
    })

    const useConnectAccount = createMutationFactory<
        TResponse,
        Error,
        ConnectAccountType
    >({
        mutationFn: connectAccount,
        invalidationFn: (args) =>
            createMutationInvalidateFn(connectAccountMutationKey, args),
    })

    return {
        ...apiCrudHooks,
        API,
        route,
        updateIndex,
        connectAccount,
        useUpdateIndex,
        useConnectAccount,
    }
}
