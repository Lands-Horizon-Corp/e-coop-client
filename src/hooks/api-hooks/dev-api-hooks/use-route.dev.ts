import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import apiRouteService from '@/api-service/developer-services/api-route-service'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import { IAPIHook, IGroupedRoute, IQueryProps } from '@/types'

export const useGroupRoutes = ({
    enabled,
    showMessage = true,
}: IAPIHook<IGroupedRoute[], string> & IQueryProps<IGroupedRoute> = {}) => {
    return useQuery<IGroupedRoute[], string>({
        queryKey: ['loan-status', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                apiRouteService.allList()
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
