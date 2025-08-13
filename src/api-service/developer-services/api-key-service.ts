import { IAPIKey } from '@/types'

import APIService from '../api-service'

export const refreshAPIKey = async () => {
    const response = await APIService.post<void, IAPIKey>(
        '/api/v1/user-organization/developer-key-refresh'
    )
    return response.data
}

export default { refreshAPIKey }
