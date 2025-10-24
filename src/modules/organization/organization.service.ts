import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
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
    useGetById: useGetOrganizationById,
    useGetAll,
} = apiCrudHooks

const { getById: getOrganizationById, route, API } = apiCrudService

export {
    useCreateOrganization,
    useUpdateOrganization,
    useGetAll,
    apiCrudHooks,
    apiCrudService,
    useGetOrganizationById,
}

interface Options<TData = IOrganization[]> {
    options?: HookQueryOptions<TData>
}

export const useGetAllOrganizations = ({
    options,
}: Options<IOrganization[]> = {}) => {
    return useQuery<IOrganization[]>({
        queryKey: ['organization', 'resource', 'all'],
        queryFn: async () => {
            return API.get<IOrganization[]>(route).then((res) => res.data)
        },
        ...options,
    })
}

export const useGetOrganizationWithPoliciesById = ({
    options,
    organizationId,
}: Options<IOrganizationWithPolicies> & { organizationId: TEntityId }) => {
    return useQuery<IOrganizationWithPolicies, Error>({
        queryKey: ['organization', 'current', organizationId],
        queryFn: () => getOrganizationById({ id: organizationId }),
        ...options,
    })
}

export const logger = Logger.getInstance('organization')
