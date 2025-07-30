import APIService from '@/api-service/api-service'
import { createAPICrudService } from '@/factory/api-factory-service'

import {
    ICreateOrganizationResponse,
    IOrganization,
    IOrganizationRequest,
    IOrganizationWithPolicies,
    TEntityId,
} from '@/types'

const OrganizationCrudServices = createAPICrudService<
    ICreateOrganizationResponse,
    IOrganizationRequest
>('/organization')

export const { create, getById, updateById, deleteById, deleteMany } =
    OrganizationCrudServices

export const OrganizationService = {
    ...OrganizationCrudServices,
}

export const getAllOrganizations = async () => {
    const response = await APIService.get<IOrganization[]>(`/organization`)
    return response.data
}

export const getOrganizationById = async (id: TEntityId) => {
    const response = await APIService.get<IOrganizationWithPolicies>(
        `/organization/${id}`
    )
    return response.data
}
