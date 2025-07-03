import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as OrganizationService from '@/api-service/organization-services/organization-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    ICreateOrganizationResponse,
    IOperationCallbacks,
    IOrganization,
    IOrganizationPaginated,
    IOrganizationRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateOrganization = ({
    showMessage = true,
    onError,
    onSuccess,
}: IAPIHook<ICreateOrganizationResponse, string> & IQueryProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        ICreateOrganizationResponse,
        string,
        IOrganizationRequest
    >({
        mutationKey: ['organization', 'create'],
        mutationFn: async (data) => {
            const [error, newOrg] = await withCatchAsync(
                OrganizationService.createOrganization(data)
            )

            if (error) {
                console.error('Error', error)
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['organization', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['organization', newOrg.organization.id],
            })
            queryClient.removeQueries({
                queryKey: ['organization', 'loader', newOrg.organization.id],
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

export const useGetOrganizationById = (organizationId: TEntityId) => {
    return useQuery<IOrganization>({
        queryKey: ['organization', 'resource-query', organizationId],
        enabled: !!organizationId,
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                OrganizationService.getOrganizationById(organizationId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw new Error(errorMessage)
            }

            return result
        },
    })
}

export const useOrganizations = ({
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
        retry: 1,
    })
}

export const useFilteredPaginatedOrganizations = ({
    sort,
    enabled,
    filterPayload,
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
