import { useQuery } from '@tanstack/react-query'

import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import {
    IOrganization,
    IOrganizationRequest,
    IOrganizationWithPolicies,
} from './organization.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IOrganization,
    IOrganizationRequest
>({ url: 'api/v1/organization', baseKey: 'organization' })

const {
    useCreate: useCreateOrganization,
    useUpdateById: useUpdateOrganization,
    useGetById,
    useGetAll,
} = apiCrudHooks

const { getById: getOrganizationById } = apiCrudService

export {
    useCreateOrganization,
    useUpdateOrganization,
    useGetById,
    useGetAll,
    apiCrudHooks,
    apiCrudService,
}

const { API, route } = createAPIRepository('/api/v1/organization')

export const getAllOrganizations = async () => {
    return (await API.get<IOrganization[]>(route)).data
}

interface Options<TData = IOrganization[]> {
    options?: HookQueryOptions<TData>
}

export const useGetAllOrganizations = ({
    options,
}: Options<IOrganization[]> = {}) => {
    return useQuery<IOrganization[]>({
        queryKey: ['organization', 'resource', 'all'],
        queryFn: getAllOrganizations,
        ...options,
    })
}

export const useGetOrganizationById = ({
    options,
    organizationId,
}: Options<IOrganizationWithPolicies> & { organizationId: TEntityId }) => {
    return useQuery<IOrganizationWithPolicies, Error>({
        queryKey: ['organization', 'current', organizationId],
        queryFn: () => getOrganizationById({ id: organizationId }),
        ...options,
    })
}
