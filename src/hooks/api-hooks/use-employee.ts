import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as UserOrganizationService from '@/api-service/user-organization-service'

import {
    IAPIHook,
    IEmployee,
    TEntityId,
    IQueryProps,
    IUserOrganization,
    IAPIFilteredPaginatedHook,
    IUserOrganizationPaginated,
} from '@/types'
import { createMutationHook } from './api-hook-factory'

export const useEmployees = ({
    enabled,
    showMessage = true,
}: IAPIHook<IUserOrganizationPaginated, string> & IQueryProps = {}) => {
    return useQuery<IUserOrganization<IEmployee>[], string>({
        queryKey: ['employee', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                UserOrganizationService.getAllEmployees()
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

export const useFilteredPaginatedEmployees = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IUserOrganizationPaginated<IEmployee>, string> &
    IQueryProps = {}) => {
    return useQuery<IUserOrganizationPaginated<IEmployee>, string>({
        queryKey: [
            'employee',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                UserOrganizationService.getPaginatedEmployees({
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

export const useDeleteEmployee = createMutationHook<void, string, TEntityId>(
    (vars) => UserOrganizationService.deleteEmployee(vars),
    'User deleted.'
)
