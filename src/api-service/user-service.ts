import APIService from './api-service'

import { IMedia, IUserBase, TEntityId } from '@/types'

const BASE_ENDPOINT = '/user'

export const getUserById = async (userId: TEntityId) => {
    const res = await APIService.get<IUserBase>(`/user/${userId}`)
    return res.data
}

export const getUserMedias = async (userId: TEntityId) => {
    const res = await APIService.get<IMedia[]>(
        `${BASE_ENDPOINT}/${userId}/medias`
    )
    return res.data
}
