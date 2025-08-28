import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import {
    IUserOrganizationPaginated,
    apiCrudService,
} from '@/modules/user-organization'
import { HookQueryOptions } from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions } from '@/types'

import { IEmployee } from '../user'

// ⚙️🛠️ API SERVICE STARTS HERE
const getPaginatedEmployees = async ({
    query,
    url,
}: {
    query?: TAPIQueryOptions
    url?: string
}) => {
    const newUrl = qs.stringifyUrl(
        {
            url: url || `${apiCrudService.route}/search`,
            query,
        },
        { skipNull: true }
    )

    const response =
        await apiCrudService.API.get<IUserOrganizationPaginated<IEmployee>>(
            newUrl
        )
    return response.data
}

// 🪝 HOOK STARTS HERE
export const useFilteredPaginatedEmployees = ({
    query,
    options,
}: {
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IUserOrganizationPaginated<IEmployee>, Error>
}) => {
    return useQuery<IUserOrganizationPaginated<IEmployee>, Error>({
        ...options,
        queryKey: ['employee', 'paginated', query],
        queryFn: async () => await getPaginatedEmployees({ query }),
    })
}
