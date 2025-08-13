import { IMedia, IUserBase, TEntityId } from '@/types'

import APIService from './api-service'

export const getUserById = async (userId: TEntityId) => {
    const res = await APIService.get<IUserBase>(`/api/v1/user/${userId}`)
    return res.data
}

export const getUserMedias = async (userId: TEntityId) => {
    const res = await APIService.get<IMedia[]>(`/api/v1/${userId}/medias`)
    return res.data
}
