import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as FootstepService from '@/api-service/footstep-service'

import {
    TEntityId,
    IFootstepPaginated,
    IFilterPaginatedHookProps,
} from '@/types'

export type TFootstepHookMode = 'me' | 'branch' | 'user-organization'

export const useFilteredPaginatedFootsteps = ({
    sort,
    mode,
    user_org_id,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 1 },
}: {
    mode?: TFootstepHookMode
} & { user_org_id?: TEntityId } & IFilterPaginatedHookProps) => {
    return useQuery<IFootstepPaginated, string>({
        queryKey: [
            'footstep',
            'resource-query',
            mode,
            user_org_id,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            let url: string = `me`

            if (mode == 'branch') {
                url = 'branch'
            } else if (mode == 'user-organization') {
                url = `user-organization/${user_org_id}`
            }

            const [error, result] = await withCatchAsync(
                FootstepService.getPaginatedFootsteps({
                    url,
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
