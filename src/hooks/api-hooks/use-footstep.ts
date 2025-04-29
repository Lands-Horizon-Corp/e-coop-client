import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import FootstepService from '@/api-service/footstep-service'

import { IFilterPaginatedHookProps } from './types'
import { IFootstepPaginatedResource } from '@/types/coop-types'

export const useFilteredPaginatedFootsteps = ({
    sort,
    filterPayload,
    preloads = [],
    mode = 'self',
    pagination = { pageSize: 10, pageIndex: 1 },
}: { mode?: 'team' | 'self' } & IFilterPaginatedHookProps) => {
    return useQuery<IFootstepPaginatedResource, string>({
        queryKey: [
            'footstep',
            'resource-query',
            mode,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            let serviceFn = FootstepService.getFootsteps

            if (mode === 'team') serviceFn = FootstepService.getFootstepsTeam
            else serviceFn = FootstepService.getFootsteps

            const [error, result] = await withCatchAsync(
                serviceFn({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
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
        retry: 1,
    })
}
