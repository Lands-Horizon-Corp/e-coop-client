import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import { ICategory } from '../category'
import {
    IOrganization,
    IOrganizationEditRequest,
    IOrganizationRequest,
    IOrganizationWithPolicies,
} from './organization.types'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: organizationBaseKey,
} = createDataLayerFactory<IOrganization, IOrganizationRequest>({
    url: 'api/v1/organization',
    baseKey: 'organization',
})

const {
    useCreate: useCreateOrganization,
    // useUpdateById: useUpdateOrganization,
    useGetById: useGetOrganizationById,
    useGetAll,
} = apiCrudHooks

const {
    getById: getOrganizationById,
    updateById: updateOrganizationById,
    route,
    API,
} = apiCrudService

export {
    useCreateOrganization,
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

export const useUpdateOrganization = createMutationFactory<
    IOrganization,
    Error,
    { id: TEntityId; payload: IOrganizationRequest | IOrganizationEditRequest }
>({
    mutationFn: (variables) =>
        updateOrganizationById({
            id: variables.id,
            payload: variables.payload,
        }),
    invalidationFn: (args) =>
        updateMutationInvalidationFn(organizationBaseKey, args),
})

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

export const useGetAllOrganizationsExplore = ({
    mode,
    options,
}: {
    mode: 'featured' | 'recently'
    options?: HookQueryOptions<IOrganization[]>
}) => {
    return useQuery<IOrganization[]>({
        queryKey: ['organization', 'resource', mode],
        queryFn: async () => {
            return API.get<IOrganization[]>(`${route}/${mode}`).then(
                (res) => res.data
            )
        },
        ...options,
    })
}

export type TGetAllByCategory = {
    category: ICategory
    organizations: IOrganization[]
    _searchStats?: {
        originalCount: number
        filteredCount: number
        hasResults: boolean
    }
}

export const useGetAllOrganizationsByCategories = ({
    options,
}: {
    options?: HookQueryOptions<TGetAllByCategory[]>
} = {}) => {
    return useQuery<TGetAllByCategory[]>({
        queryKey: ['organization', 'resource', 'category'],
        queryFn: async () => {
            return API.get<TGetAllByCategory[]>(`${route}/category`).then(
                (res) => res.data
            )
        },
        ...options,
    })
}

export const logger = Logger.getInstance('organization')
