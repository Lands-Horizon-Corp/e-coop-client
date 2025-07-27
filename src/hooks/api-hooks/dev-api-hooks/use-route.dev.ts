import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import apiRouteService from '@/api-service/developer-services/api-route-service'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import { IAPIHook, IAPIList, IQueryProps } from '@/types'

export const useGroupRoutes = ({
    enabled,
    showMessage = true,
}: IAPIHook<IAPIList, string> & IQueryProps<IAPIList> = {}) => {
    return useQuery<IAPIList, string>({
        queryKey: ['api-list', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(apiRouteService.get())

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        enabled,
        retry: 1,
    })
}
