import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as FootstepService from '@/api-service/footstep-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IFilterPaginatedHookProps,
    IFootstepPaginated,
    TEntityId,
} from '@/types'

export type TFootstepHookMode =
    | 'me' // current auth user footstep on current branch
    | 'me-branch' // current auth user all footstep from all branches
    | 'branch' // all footsteps from different users in current auth users branch
    | 'user-organization' // all footstep of specific user
    | 'member-profile' // all footstep of a member ( member profile with user only )

export const useFilteredPaginatedFootsteps = ({
    sort,
    mode,
    userOrgId,
    filterPayload,
    memberProfileId,
    pagination = { pageSize: 10, pageIndex: 1 },
}: {
    mode?: TFootstepHookMode
} & {
    userOrgId?: TEntityId
    memberProfileId?: TEntityId
} & IFilterPaginatedHookProps) => {
    return useQuery<IFootstepPaginated, string>({
        queryKey: [
            'footstep',
            'resource-query',
            mode,
            userOrgId,
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            let url: string = `me`
            if (mode == 'me-branch') {
                url = 'current/me/branch'
            } else if (mode == 'branch') {
                url = 'branch'
            } else if (mode == 'user-organization') {
                url = `user-organization/${userOrgId}`
            } else if (mode == 'member-profile')
                url = `member-profile/${memberProfileId}`

            const [error, result] = await withCatchAsync(
                FootstepService.search({
                    targetUrl: `${url}/search`,
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
