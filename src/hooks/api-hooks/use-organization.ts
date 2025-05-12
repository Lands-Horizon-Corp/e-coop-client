import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as OrganizationService from '@/api-service/organization-service'

import {
    TEntityId,
    IOrganization,
    IOrganizationRequest,
    IOrganizationPaginated,
} from '@/types'
import {
    IAPIHook,
    IQueryProps,
    IOperationCallbacks,
    IAPIFilteredPaginatedHook,
} from '@/types/api-hooks-types'

export const useCreateOrganization = ({
    showMessage = true,
    onError,
    onSuccess,
}: IAPIHook<IOrganization, string> & IQueryProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IOrganization, string, IOrganizationRequest>({
        mutationKey: ['organization', 'create'],
        mutationFn: async (data) => {
            const [error, newOrg] = await withCatchAsync(
                OrganizationService.createOrganization(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['organization', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['organization', newOrg.id],
            })
            queryClient.removeQueries({
                queryKey: ['organization', 'loader', newOrg.id],
            })

            if (showMessage) toast.success('New Organization Created')
            onSuccess?.(newOrg)

            return newOrg
        },
    })
}

export const useUpdateOrganization = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IOrganization, string> = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IOrganization,
        string,
        { id: TEntityId; data: IOrganizationRequest }
    >({
        mutationKey: ['organization', 'update'],
        mutationFn: async ({ id, data }) => {
            const [error, result] = await withCatchAsync(
                OrganizationService.updateOrganization(id, data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['organization', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['organization', id],
            })
            queryClient.removeQueries({
                queryKey: ['organization', 'loader', id],
            })

            toast.success('Organization updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useDeleteOrganization = ({
    onError,
    onSuccess,
}: IOperationCallbacks = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['organization', 'delete'],
        mutationFn: async (id) => {
            const [error] = await withCatchAsync(
                OrganizationService.deleteOrganization(id)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['organization', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['organization', id],
            })
            queryClient.removeQueries({
                queryKey: ['organization', 'loader', id],
            })

            toast.success('Organization deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useOrganizations = ({
    enabled,
    showMessage = true,
}: IAPIHook<IOrganization[], string> & IQueryProps = {}) => {
    return useQuery<IOrganization[], string>({
        queryKey: ['organization', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                OrganizationService.getAllOrganizations()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}

export const useFilteredPaginatedOrganizations = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IOrganizationPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IOrganizationPaginated, string>({
        queryKey: [
            'organization',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                OrganizationService.getPaginatedOrganizations({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
