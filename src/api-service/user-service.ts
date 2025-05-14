import APIService from './api-service'
import { IMedia, TEntityId } from '@/types'

const BASE_ENDPOINT = '/user'

export const getUserMedias = async (userId: TEntityId) => {
    const res = await APIService.get<IMedia[]>(
        `${BASE_ENDPOINT}/${userId}/medias`
    )
    return res.data
}
