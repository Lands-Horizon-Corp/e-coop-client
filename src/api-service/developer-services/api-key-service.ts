import { IAPIKey } from '@/types'

import APIService from '../api-service'

export const refreshAPIKey = async () => {
    const response = await APIService.post<void, IAPIKey>(
        '/user-organization/developer-key-refresh'
    )
    return response.data
}

export default { refreshAPIKey }
