import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as OrganizationService from '@/api-service/organization-services/organization-service'
import {
    createMutationHook,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import {
    IAPIHook,
    ICreateOrganizationResponse,
    IOrganization,
    IOrganizationRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

const KEY = 'organization'

export const useCreateOrganization = createMutationHook<
    ICreateOrganizationResponse,
    string,
    IOrganizationRequest
>((payload) => OrganizationService.create(payload), 'New Organization Created')

export const useUpdateOrganization = createMutationHook<
    IOrganization,
    string,
    { organizationId: TEntityId; data: IOrganizationRequest }
>(
    (payload) =>
        OrganizationService.updateById(payload.organizationId, payload.data),
    'Organization Updated',
    (args) => updateMutationInvalidationFn(KEY, args)
)

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
